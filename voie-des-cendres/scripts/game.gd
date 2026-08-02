extends Node

## État global du joueur + moteur de règles (stats, drapeaux, secrets, sauvegarde).

const SAVE_PATH := "user://save.json"
const SECRET_TOTAL := 12

const REALMS := [
	"Mortel",
	"Souffle Éveillé",
	"Rivière Intérieure",
	"Racine de Jade",
	"Fondation du Vide",
	"Cœur de Braise",
]

const STAT_NAMES := {
	"corps": "Corps",
	"souffle": "Souffle",
	"esprit": "Esprit",
	"perception": "Perception",
	"destin": "Destin",
}

var stats := {}
var realm := 0
var techniques: Array = []
var items: Array = []
var flags := {}
var secrets: Array = []
var current_node := "start"
var log_lines: Array = []
var block_start := 0
var story := {}

func _ready() -> void:
	load_story()
	if not load_game():
		reset_game()

func reset_game() -> void:
	stats = {"corps": 5, "souffle": 0, "esprit": 5, "perception": 5, "destin": 1}
	realm = 0
	techniques = []
	items = []
	flags = {}
	secrets = []
	current_node = "start"
	log_lines = []
	block_start = 0
	save_game()

func load_story() -> void:
	var f := FileAccess.open("res://data/story.json", FileAccess.READ)
	if f == null:
		push_error("Impossible de charger l'histoire")
		return
	var parsed = JSON.parse_string(f.get_as_text())
	if typeof(parsed) == TYPE_DICTIONARY:
		story = parsed
	else:
		push_error("story.json invalide")

func player_title() -> String:
	if flags.has("chef_secte"):
		return "Maître de la Secte du Pin Noir"
	if flags.has("interne"):
		return "Disciple interne"
	if flags.has("outer_disciple"):
		return "Disciple externe"
	return "Disciple-balai"

## Vérifie si les conditions d'un choix sont remplies.
func meets(req: Dictionary) -> bool:
	for key in req.keys():
		var val = req[key]
		match key:
			"corps", "souffle", "esprit", "perception", "destin":
				if int(stats.get(key, 0)) < int(val):
					return false
			"realm":
				if realm < int(val):
					return false
			"realm_max":
				if realm > int(val):
					return false
			"secrets":
				if secrets.size() < int(val):
					return false
			"tech":
				if not techniques.has(val):
					return false
			"flag":
				var wanted: Array = val if val is Array else [val]
				for fl in wanted:
					if not flags.has(fl):
						return false
			"not_flag":
				var banned: Array = val if val is Array else [val]
				for fl in banned:
					if flags.has(fl):
						return false
	return true

## Texte d'indice pour un choix verrouillé (non secret).
func requirement_hint(req: Dictionary) -> String:
	var parts: Array = []
	for key in req.keys():
		match key:
			"corps", "souffle", "esprit", "perception", "destin":
				if int(stats.get(key, 0)) < int(req[key]):
					parts.append("%s %d" % [STAT_NAMES[key], int(req[key])])
			"realm":
				if realm < int(req[key]):
					parts.append("Rang « %s »" % REALMS[int(req[key])])
			"secrets":
				if secrets.size() < int(req[key]):
					parts.append("%d secrets" % int(req[key]))
			"tech":
				if not techniques.has(req[key]):
					parts.append("Technique requise")
	if parts.is_empty():
		return ""
	return "Requiert : " + ", ".join(parts)

## Applique les effets d'un choix ; retourne les lignes à afficher dans le journal.
func apply_effects(eff: Dictionary) -> Array:
	var notes: Array = []
	if eff.has("stats"):
		for key in eff["stats"].keys():
			var delta := int(eff["stats"][key])
			stats[key] = int(stats.get(key, 0)) + delta
			var sign := "+" if delta >= 0 else ""
			notes.append("[color=#8fd3a7]%s%d %s[/color]" % [sign, delta, STAT_NAMES[key]])
	if eff.has("flags"):
		for fl in eff["flags"]:
			flags[fl] = true
	if eff.has("remove_flags"):
		for fl in eff["remove_flags"]:
			flags.erase(fl)
	if eff.has("tech"):
		if not techniques.has(eff["tech"]):
			techniques.append(eff["tech"])
			notes.append("[color=#e8a94c]✦ Technique apprise : %s[/color]" % eff["tech"])
	if eff.has("item"):
		if not items.has(eff["item"]):
			items.append(eff["item"])
			notes.append("[color=#c9a86a]Objet obtenu : %s[/color]" % eff["item"])
	if eff.has("secret_id"):
		if not secrets.has(eff["secret_id"]):
			secrets.append(eff["secret_id"])
			notes.append("[color=#b48ce0]✦ Secret découvert (%d/%d)[/color]" % [secrets.size(), SECRET_TOTAL])
	if eff.has("realm"):
		var new_realm := int(eff["realm"])
		if new_realm > realm:
			realm = new_realm
			notes.append("[color=#ff9d5c]☲ PERCÉE ! Tu atteins le rang « %s ».[/color]" % REALMS[realm])
	return notes

func save_game() -> void:
	var data := {
		"stats": stats,
		"realm": realm,
		"techniques": techniques,
		"items": items,
		"flags": flags,
		"secrets": secrets,
		"current_node": current_node,
		"log_lines": log_lines.slice(max(0, log_lines.size() - 300)),
		"block_start": clamp(block_start - max(0, log_lines.size() - 300), 0, 300),
	}
	var f := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if f:
		f.store_string(JSON.stringify(data))

func load_game() -> bool:
	if not FileAccess.file_exists(SAVE_PATH):
		return false
	var f := FileAccess.open(SAVE_PATH, FileAccess.READ)
	if f == null:
		return false
	var parsed = JSON.parse_string(f.get_as_text())
	if typeof(parsed) != TYPE_DICTIONARY:
		return false
	stats = parsed.get("stats", {})
	realm = int(parsed.get("realm", 0))
	techniques = parsed.get("techniques", [])
	items = parsed.get("items", [])
	flags = parsed.get("flags", {})
	secrets = parsed.get("secrets", [])
	current_node = parsed.get("current_node", "start")
	log_lines = parsed.get("log_lines", [])
	block_start = int(parsed.get("block_start", 0))
	if not story.has(current_node):
		current_node = "start"
	return stats.has("corps")
