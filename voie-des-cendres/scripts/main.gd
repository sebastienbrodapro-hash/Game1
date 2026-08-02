extends Control

## Interface : onglet Histoire (journal + choix) et onglet Personnage (fiche).

const COLOR_BG := Color("14100c")
const COLOR_PANEL := Color("1d1712")
const COLOR_TEXT := Color("e8ddc8")
const COLOR_ACCENT := Color("e8a94c")

var tabs: TabContainer
var story_log: RichTextLabel
var choices_box: VBoxContainer
var sheet: RichTextLabel

func _ready() -> void:
	_build_ui()
	_render_saved_log()
	if Game.log_lines.is_empty():
		_enter_node(Game.current_node, true)
	else:
		_show_choices(Game.current_node)
	_update_sheet()

func _build_ui() -> void:
	var bg := ColorRect.new()
	bg.color = COLOR_BG
	bg.set_anchors_preset(Control.PRESET_FULL_RECT)
	add_child(bg)

	tabs = TabContainer.new()
	tabs.set_anchors_preset(Control.PRESET_FULL_RECT)
	tabs.add_theme_font_size_override("font_size", 30)
	add_child(tabs)

	# --- Onglet Histoire ---
	var story_margin := MarginContainer.new()
	story_margin.name = "Histoire"
	_set_margins(story_margin, 18)
	tabs.add_child(story_margin)

	var story_vbox := VBoxContainer.new()
	story_vbox.add_theme_constant_override("separation", 12)
	story_margin.add_child(story_vbox)

	story_log = RichTextLabel.new()
	story_log.bbcode_enabled = true
	story_log.scroll_following = true
	story_log.size_flags_vertical = Control.SIZE_EXPAND_FILL
	story_log.add_theme_font_size_override("normal_font_size", 30)
	story_log.add_theme_font_size_override("bold_font_size", 32)
	story_log.add_theme_font_size_override("italics_font_size", 30)
	story_log.add_theme_color_override("default_color", COLOR_TEXT)
	story_vbox.add_child(story_log)

	var sep := HSeparator.new()
	story_vbox.add_child(sep)

	var choices_scroll := ScrollContainer.new()
	choices_scroll.custom_minimum_size = Vector2(0, 380)
	choices_scroll.size_flags_vertical = Control.SIZE_SHRINK_END
	story_vbox.add_child(choices_scroll)

	choices_box = VBoxContainer.new()
	choices_box.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	choices_box.add_theme_constant_override("separation", 10)
	choices_scroll.add_child(choices_box)

	# --- Onglet Personnage ---
	var sheet_margin := MarginContainer.new()
	sheet_margin.name = "Personnage"
	_set_margins(sheet_margin, 18)
	tabs.add_child(sheet_margin)

	var sheet_vbox := VBoxContainer.new()
	sheet_vbox.add_theme_constant_override("separation", 12)
	sheet_margin.add_child(sheet_vbox)

	sheet = RichTextLabel.new()
	sheet.bbcode_enabled = true
	sheet.size_flags_vertical = Control.SIZE_EXPAND_FILL
	sheet.add_theme_font_size_override("normal_font_size", 30)
	sheet.add_theme_font_size_override("bold_font_size", 34)
	sheet.add_theme_color_override("default_color", COLOR_TEXT)
	sheet_vbox.add_child(sheet)

	var restart := Button.new()
	restart.text = "☠ Recommencer une nouvelle vie"
	restart.add_theme_font_size_override("font_size", 26)
	restart.pressed.connect(_on_restart_pressed)
	sheet_vbox.add_child(restart)

func _set_margins(m: MarginContainer, px: int) -> void:
	for side in ["margin_left", "margin_right", "margin_top", "margin_bottom"]:
		m.add_theme_constant_override(side, px)

# ---------------------------------------------------------------- récit

func _render_saved_log() -> void:
	story_log.clear()
	for line in Game.log_lines:
		story_log.append_text(str(line) + "\n")

func _log(line: String) -> void:
	Game.log_lines.append(line)
	story_log.append_text(line + "\n")

func _enter_node(id: String, silent_save := false) -> void:
	if id == "__restart":
		Game.reset_game()
		story_log.clear()
		_enter_node("start", true)
		_update_sheet()
		return
	if not Game.story.has(id):
		_log("[color=#ff6b6b]Erreur : passage introuvable (%s)[/color]" % id)
		return
	Game.current_node = id
	var node: Dictionary = Game.story[id]
	if node.has("on_enter"):
		for note in Game.apply_effects(node["on_enter"]):
			_log(note)
	_log("")
	_log(str(node.get("text", "")))
	_show_choices(id)
	if not silent_save:
		Game.save_game()
	_update_sheet()

func _show_choices(id: String) -> void:
	for child in choices_box.get_children():
		child.queue_free()
	if not Game.story.has(id):
		return
	var node: Dictionary = Game.story[id]
	var choice_list: Array = node.get("choices", [])
	for i in choice_list.size():
		var choice: Dictionary = choice_list[i]
		var req: Dictionary = choice.get("require", {})
		var once_flag := str(choice.get("once", ""))
		if once_flag != "" and Game.flags.has(once_flag):
			continue
		var ok := Game.meets(req)
		var is_secret := bool(choice.get("secret", false))
		if is_secret and not ok:
			continue
		var btn := Button.new()
		btn.add_theme_font_size_override("font_size", 27)
		btn.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
		btn.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		var label := str(choice.get("text", "…"))
		if is_secret:
			label = "✦ " + label
			btn.add_theme_color_override("font_color", Color("b48ce0"))
		if not ok:
			btn.disabled = true
			var hint := Game.requirement_hint(req)
			if hint != "":
				label += "\n🔒 " + hint
		btn.text = label
		btn.pressed.connect(_on_choice_pressed.bind(id, i))
		choices_box.add_child(btn)

func _on_choice_pressed(node_id: String, index: int) -> void:
	var node: Dictionary = Game.story[node_id]
	var choice: Dictionary = node.get("choices", [])[index]
	_log("[color=#8a7d68][i]› %s[/i][/color]" % str(choice.get("text", "")))
	var once_flag := str(choice.get("once", ""))
	if once_flag != "":
		Game.flags[once_flag] = true
	if choice.has("effects"):
		for note in Game.apply_effects(choice["effects"]):
			_log(note)
	_enter_node(str(choice.get("goto", "hub")))

# ---------------------------------------------------------------- fiche

func _update_sheet() -> void:
	var s: Dictionary = Game.stats
	var bb := "[b][color=#e8a94c]%s[/color][/b]\n" % "Su Han"
	bb += "[color=#8a7d68]%s[/color]\n\n" % Game.player_title()
	bb += "[b]Rang de cultivation[/b]\n[color=#ff9d5c]☲ %s[/color]\n\n" % Game.REALMS[Game.realm]
	bb += "[b]Statistiques[/b]\n"
	for key in ["corps", "souffle", "esprit", "perception", "destin"]:
		var val := int(s.get(key, 0))
		bb += "%s : [b]%d[/b]  [color=#5a4f42]%s[/color]\n" % [Game.STAT_NAMES[key], val, "▮".repeat(clamp(val, 0, 30))]
	bb += "\n[b]Techniques[/b]\n"
	if Game.techniques.is_empty():
		bb += "[color=#8a7d68]Aucune. Tes veines sont encore de pierre.[/color]\n"
	else:
		for t in Game.techniques:
			bb += "[color=#e8a94c]✦[/color] %s\n" % t
	bb += "\n[b]Possessions[/b]\n"
	if Game.items.is_empty():
		bb += "[color=#8a7d68]Un balai usé. C'est tout.[/color]\n"
	else:
		for it in Game.items:
			bb += "• %s\n" % it
	bb += "\n[b]Secrets découverts[/b]\n[color=#b48ce0]%d / %d[/color]\n" % [Game.secrets.size(), Game.SECRET_TOTAL]
	bb += "[color=#5a4f42]La montagne cache plus qu'elle ne montre. Reviens quand tes yeux seront plus affûtés.[/color]\n"
	sheet.text = bb

func _on_restart_pressed() -> void:
	var dialog := ConfirmationDialog.new()
	dialog.dialog_text = "Abandonner cette vie et tout recommencer ?"
	dialog.ok_button_text = "Oui, renaître"
	dialog.cancel_button_text = "Non"
	add_child(dialog)
	dialog.confirmed.connect(func(): _enter_node("__restart"))
	dialog.popup_centered()
