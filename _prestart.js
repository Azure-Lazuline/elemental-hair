ig.Image.inject({
	draw(...args)
	{
		if (this.elementalhairfiles != null)
		{
			//if (this.elementalhairfiles.length > 0)
			//	console.warn(this.elementalhairfiles.length);
			for (var d = this.elementalhairfiles.length-1; d>=0; d--)
			{
				var file = this.elementalhairfiles[d];
				
				if (file.func == null || file.func())
				{ //if a replaceable file, draw the new one instead, with all the same parameters
					if(!sc.options.get("element-hair-enabled") && file.revertifoff)
					{ //"revert if off" is enabled, and it's off
						this.parent(...args);
						return;
					}
					else
					{ //swap it out for the other colors!
						let olddata = this.data;
						let num = elementalhair.GetCharacterElement(file.characterlist);
						if (file.elementalnumcolors == 1 || !sc.options.get("element-hair-enabled"))
							num = 0;
						if (file.elementalnumcolors == 10) //legacy support for an older format
							num += 5;
						this.data = file.elementhairreplacements[num];
						this.parent(...args);
						this.data = olddata;
						
						return;
					}
				}
			}
		}
		this.parent(...args);
	}
});

ig.ENTITY.Player.inject({
  update(...args) {

	  elementalhair.playerElement = this.model.currentElementMode;

      return this.parent(...args);
  },
});

ig.MessageAreaGui.inject({
  modelChanged(a, d, c) {
	  if(d == sc.MESSAGE_EVENT.PERSON_ADDED)
	  {
		  if(c == "main.lea" && sc.model.player.currentElementMode != 0 && sc.options.get("element-hair-auto-neutral"))
		  { //swap to neutral if Lea's in the cutscene
				sc.model.player.setElementMode(0, true);
				elementalhair.playerElement = 0; //set the displayed color to neutral even when in pause menu cutscenes where player.update doesn't run
		  }
	  }
      this.parent(a, d, c);
  },
});

sc.Arena.inject({
  onLevelLoadStart(...args) {
	if (this.active)
	{
		//the game snaps you to neutral with no VFX on the first frame the fight actually begins which is awkward, so i do it on level load too
		if (!(this.runtime.rush && this.runtime.currentRound > 0) && sc.options.get("element-hair-enabled"))
			sc.model.player.setElementMode(0, true);
	}
	
	this.parent(...args);
  },
});

ig.Storage.inject({
	onLevelLoadStart(a){
		var plotline = ig.vars.get("plot.line");
		//console.warn(a.name);
		//console.warn(plotline);
		
		//list of rooms to auto-return to neutral in (for ending cutscenes mostly)
		if (a.name == "arid-dng/second/f99/end-room" //post-elephant
			|| a.name == "arid/lab/ug-04-sidwell-meeting-room" && plotline == 50150 //post-dlc
			|| a.name == "evo-village/center" && plotline >= 52000 //post-fish
			|| a.name == "hideout/inner-1") //entering the hideout
		{
			if(sc.model && sc.model.player && sc.options.get("element-hair-enabled"))
				sc.model.player.setElementMode(0, true);
		}
		
		elementalhair.leaPettingShizuka = null;
		
		this.parent(a);
	},
});

ig.DreamFx.inject({
	start(...args){
		if(sc.model && sc.model.player && sc.options.get("element-hair-enabled"))
			sc.model.player.setElementMode(0, true); //reset element when dreaming (so Lea always logs in with neutral)
		this.parent(...args);
	}
});

ig.ACTION_STEP.SHOW_EXTERN_ANIM.inject({
	start(a){
		this.parent(a);
		if (a.name == "shizuka" && this.animName == "leaPettingPre") //most animations on this sheet are recolored based on shizuka. but the petting animation has Lea in it too and that's more important. so set a flag that can be read to change who's palette it uses. this is only cleared on level load
			elementalhair.leaPettingShizuka = true;
	}
});

//add new property "unremovable" to items so the game doesn't auto-delete anything put under the "skins" tab if there's no skin data found,
//so you can use it for custom palette reward items
sc.PlayerModel.inject({
	removeItem(a, c, d, e)
	{
		var item = sc.inventory.getItem(a);
		if (item && item.unremovable) return false;
		
		return this.parent(a, c, d, e);
	}
});

let options = {};
for (let [key, value] of Object.entries(sc.OPTIONS_DEFINITION)) {
    options[key] = value;
    switch (key) {
        case "lighting":			
            options["element-hair-enabled"] = {
				type: 'CHECKBOX',
				cat: sc.OPTION_CATEGORY.VIDEO,
				init: true,
				fill: true,
				showPercentage: true,
				hasDivider: true,
				header: "element-hair"
            };
            options["element-hair-party"] = {
				type: 'CHECKBOX',
				cat: sc.OPTION_CATEGORY.VIDEO,
				init: true,
				fill: true,
				showPercentage: true,
				hasDivider: false,
				header: "element-hair"
            };
            options["element-hair-auto-neutral"] = {
				type: 'CHECKBOX',
				cat: sc.OPTION_CATEGORY.VIDEO,
				init: false,
				fill: true,
				showPercentage: true,
				hasDivider: false,
				header: "element-hair"
            };
            break;
    }
}

sc.OPTIONS_DEFINITION = options;
