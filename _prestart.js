window.elementalhair = {};

elementalhair.AddAsset=function(basefile, palette, characterlist, func){
	//basefile = the root image path to replace
	//palette = the palette file to recolor that image with (6 rows, one for the base colors, then neutral heat cold shock and wave
	//characterlist = replace the image only for these characters (player, party, or PVP opponent). Can be omitted to make it replace based on the player
	//func = optional. Only replace the image when this evaluates to true
	
	const img = new ig.Image("media/element-hair/" + palette);
	elementalhair.characterlists[basefile] = characterlist;
	elementalhair.funcs[basefile] = func;
	

	const onloadBackup = img.onload.bind(img);
	let resolve;
	elementalhair.palettes[basefile] = new Promise(res => (resolve = res));
	img.onload = function() {
		onloadBackup();
		resolve(img);
	}.bind(img);
};

elementalhair.GetCharacterElement=function(characterlist){
	if (characterlist == null) 
		return this.playerElement;
	if (sc.model && sc.model.player && characterlist.includes(sc.model.player.name))
		return this.playerElement;
	
	if (elementalhair.hasPartyElementEffects)
	{
		for(var i=0;i<2;i++)
		{
			var partymember = sc.party.getPartyMemberEntityByIndex(i);
			
			//if (partymember != null && partymember.model != null) console.warn(partymember.model.name);
			
			if (partymember != null && partymember.model != null && characterlist.includes(partymember.model.name))
			{
				if (partymember.model.currentElementMode != null)
					return partymember.model.currentElementMode;
				else
					return 0;
			}
			//navigator.clipboard.writeText(Object.entries(partymember));		
		}
		
		if (sc.pvp.isActive() && sc.pvp.enemies != null)
		{
			for(var i=0;i<sc.pvp.enemies.length;i++)
			{
				if (characterlist.includes(sc.pvp.enemies[i].enemyName))
					return sc.pvp.enemies[i].elementModes.current;
				//navigator.clipboard.writeText(Object.entries(sc.pvp.enemies[i].enemyType));
				//enemies[i]: party,2,aggression,0,enemyName,avatar.apollo-4,enemyType,[object Object],enemyGroup,,defeatVarIncrease,,enemyTypeInitialized,true,dropHealOrb,0,hpAttached,[object Object],spawnPoint,[object Object],currentState,ATTACK,postStun,[object Object],nextState,,nextTimerChange,[object Object],stateTimers,[object Object],trackers,[object Object],deferredPerformedConds,,targetLoseTimer,0,reactions,[object Object],dodge,[object Object],annotate,[object Object],hpBreakReached,0,lastPoICheck,,targetFixed,false,collaboration,,collabAttribs,,elementModes,[object Object],storedEnemies,,ownerEnemy,,cameraZFocus,0,startEffect,,targetOnSpawn,false,boosterState,0,level,[object Object],visibility,[object Object],_wm,[object Object],classId,1226,params,[object Object],isCombatant,true,material,2,damageTimer,0,defeatNotified,false,dying,0,skipRumble,false,deathEffect,,manualKill,,invincibleTimer,0,stunThreshold,0,stunCombatant,,stunSteps,,stunData,[object Object],targetedBy,,threat,,regenFactor,0,regenTimer,0,walkAnims,[object Object],hitStable,3,hitIgnore,false,statusGui,[object Object],shieldsConnections,,spikeDmg,[object Object],pvp,[object Object],respawn,[object Object],effects,[object Object],tackle,[object Object],combo,[object Object],target,[object Object],tmpTarget,,replaceTargets,,ignoreTaunts,false,soundType,default,dustType,1,stepFx,[object Object],nav,[object Object],tooHighToFall,false,stepStats,[object Object],influencer,[object Object],onMoveEffect,,animSheet,[object Object],face,[object Object],currentAnim,spinShortRev,followUpAnim,meleeEndRev,faceDirFixed,false,forceFaceDirFixed,true,animationFixed,true,floatHeightOnMove,0,fly,[object Object],walkAnimsName,normal,storedWalkAnims,[object Object],currentAction,[object Object],currentActionStep,[object Object],stepTimer,0.1290000000000005,stepSync,0,stepData,[object Object],keepStateAfterAction,false,inlineActionStack,,stashed,[object Object],defaultConfig,[object Object],jumpingEnabled,true,jumping,false,floatJump,0,preJumpStats,[object Object],actionAttached,[object Object],[object Object],attributes,[object Object],faceToTarget,[object Object],animState,[object Object],animSpeedFactor,1,callbackOnFinish,,_createdAnimSheet,false,id,300,uid,677,mapId,331,settings,[object Object],name,lily,coll,[object Object],sprites,[object Object],entityAttached,[object Object],_hidden,false,_hideRequest,false,_killed,false,parent,,dmgZFocus,0,proxies,[object Object],justEnteredState,false,elementFilter,0,fallDmgFactor,0.1,difficultyModsScaledHP,1.3,secondJumpCheck,false
				//enemies[i].enemyType: cacheKey,avatar.apollo-4,cacheType,Enemy,aiGroup,,aiLearnType,[object Object],enduranceScale,1,name,,params,[object Object],credit,0,exp,1000,level,70,maxSp,16,boss,false,hpBreaks,,hpBreakCond,true,animSheet,[object Object],attribs,[object Object],proxies,[object Object],actions,[object Object],states,[object Object],reactions,[object Object],trackerDef,[object Object],headIdx,4,healDropRate,0,itemDrops,,targetDetect,[object Object],classId,249,loaded,true,failed,false,path,avatar.apollo-4,tolerateMissingResources,false,loadListeners,,loadCollectors,,referenceCount,1,emptyMapChangeCount,0,parent,,loadCallback,,bossLabel,Boss,bossOrder,0,detectType,1,boostedLevel,60,ignoreTaunts,false,elementModes,[object Object],modifiers,[object Object],size,[object Object],cameraZFocus,0,dmgZFocus,0,padding,[object Object],walkConfigs,[object Object],material,2,entityConfig,[object Object],defaultState,DEFAULT
				//console.warn(Object.entries(sc.pvp.enemies[i].elementModes.current));
			}
		}
	}
	
	return 0;
};

//main function, run once
{
	elementalhair.playerElement = 0;
	elementalhair.palettes = {};
	elementalhair.characterlists = {};
	elementalhair.funcs = {};
	elementalhair.hasPartyElementEffects = window.activeMods.find(e => e.name === "party-element-effects") != null;

	let partyenabled = function(){ return sc.options.get("element-hair-party"); };
	let shizukaenabled = function(){ return sc.options.get("element-hair-party") || sc.model.player.name == "Shizuka0"; };

	elementalhair.AddAsset("media/entity/player/move.png", "lea-palette.png");
	elementalhair.AddAsset("media/entity/player/throw.png", "lea-palette.png");
	elementalhair.AddAsset("media/entity/player/move-weak.png", "lea-palette.png");
	elementalhair.AddAsset("media/entity/player/hugging.png", "lea-palette.png");
	elementalhair.AddAsset("media/entity/player/poses.png", "lea-palette.png");
	elementalhair.AddAsset("media/entity/player/sleeping.png", "lea-palette.png");
	elementalhair.AddAsset("media/entity/player/special.png", "lea-palette.png");
	elementalhair.AddAsset("media/gui/menu.png", "lea-dialogue-palette.png", null, function(){ return !sc.options.get("element-hair-auto-neutral"); });
	elementalhair.AddAsset("media/face/lea.png", "lea-dialogue-palette.png");
	elementalhair.AddAsset("media/face/lea-hand.png", "lea-dialogue-palette.png");
	elementalhair.AddAsset("media/face/lea-panic.png", "lea-dialogue-palette.png");
	elementalhair.AddAsset("media/face/lea-special.png", "lea-dialogue-palette.png");
	elementalhair.AddAsset("media/parallax/title/lea.png", "lea-dialogue-palette.png"); //did you know going back to the title screen will show it with your last element?

	elementalhair.AddAsset("media/entity/player/move-shizuka.png", "shizuka-palette.png", ["Shizuka", "Shizuka0", "avatar.shizuka"], shizukaenabled);
	elementalhair.AddAsset("media/entity/player/throw-shizuka.png", "shizuka-palette.png", ["Shizuka", "Shizuka0", "avatar.shizuka"], shizukaenabled);
	elementalhair.AddAsset("media/entity/player/poses-shizuka.png", "shizuka-palette.png", ["Shizuka", "Shizuka0", "avatar.shizuka"], shizukaenabled);
	elementalhair.AddAsset("media/entity/player/shizuka-special.png", "shizuka-palette.png", ["Shizuka", "Shizuka0", "avatar.shizuka"], shizukaenabled);
	elementalhair.AddAsset("media/face/shizuka.png", "shizuka-dialogue-palette.png", ["Shizuka", "Shizuka0"], function(){ return sc.model.player.name == "Shizuka0"; });

	elementalhair.AddAsset("media/entity/npc/emilie.png", "emilie-palette.png", ["Emilie"], partyenabled);
	elementalhair.AddAsset("media/entity/npc/emilie-attack.png", "emilie-palette.png", ["Emilie"], partyenabled);
	elementalhair.AddAsset("media/entity/npc/glasses.png", "ctron-palette.png", ["Glasses"], partyenabled);
	elementalhair.AddAsset("media/entity/npc/schneider.png", "lukas-palette.png", ["Schneider"], partyenabled);
	elementalhair.AddAsset("media/entity/npc/luke.png", "lukas-palette.png", ["Luke"], partyenabled);
	elementalhair.AddAsset("media/entity/npc/fancyguy.png", "apollo-palette.png", ["Apollo", "avatar.apollo", "avatar.apollo-2", "avatar.apollo-3", "avatar.apollo-4"], partyenabled);
	elementalhair.AddAsset("media/entity/npc/sidekick.png", "joern-palette.png", ["Joern"], partyenabled);

	//extra files from XPC, might as well add them here since it's one line each. Applying a palette to a non-existing image doesn't mess anything up
	elementalhair.AddAsset("media/entity/npc/lea-hexa.png", "lea-palette.png");
	elementalhair.AddAsset("media/entity/npc/lea-tri.png", "lea-palette.png");
	elementalhair.AddAsset("media/entity/npc/schneiderEatFix.png", "lukas-palette.png", ["Schneider"], partyenabled);
	elementalhair.AddAsset("media/entity/npc/lukeEatFix.png", "lukas-palette.png", ["Luke"], partyenabled);
}
ig.Image.inject({
	onload(){
		var path2 = this.path.trim();
		if(elementalhair.palettes[path2] == null) return this.parent();

		this.elementalhairfunc = elementalhair.funcs[path2];
		this.elementalhaircharacters = elementalhair.characterlists[path2];

		const parent = this.parent.bind(this);
		// wait for the palette to be loaded
		elementalhair.palettes[path2].then(paletteimg => {
			
			this.elementalnumcolors=paletteimg.data.height - 1;
			if (this.elementalnumcolors != 1 && this.elementalnumcolors != 5 && this.elementalnumcolors != 10)
			{
				console.error(paletteimg.path + ": Elemental hair palette image must be 2, 6, or 11 pixels tall.");
				parent();
				return;
			}
			
			let palettecanvas = ig.$new("canvas");
			palettecanvas.width = paletteimg.data.width;
			palettecanvas.height = paletteimg.data.height;
						
			let paletteCanvasCtx = ig.system.getBufferContext(palettecanvas);
			paletteCanvasCtx.drawImage(paletteimg.data, 0, 0, paletteimg.data.width, paletteimg.data.height);
			let palettedata = paletteCanvasCtx.getImageData(0, 0, paletteimg.data.width, paletteimg.data.height);
						
			let palette=[];
			for(let x=0;x<paletteimg.data.width;x++){
				let colors=[];
				for(let y=0;y<=this.elementalnumcolors;y++){
					let i=(y*paletteimg.data.width + x) * 4;
					colors.push({r:palettedata.data[i+0],g:palettedata.data[i+1],b:palettedata.data[i+2]});
				}
				palette.push(colors);
			}

			//make the new recolors, one per element (plus neutral so you can use this as a general recoloring thing if you want)
			this.elementhairreplacements=[];
			for(let element=0;element<this.elementalnumcolors;element++)
			{
				let canvas = ig.$new("canvas");
				canvas.width = this.data.width;
				canvas.height = this.data.height;
				let canvasCtx = ig.system.getBufferContext(canvas);
				canvasCtx.drawImage(this.data, 0, 0, this.data.width, this.data.height);
				let newdata = canvasCtx.getImageData(0, 0, this.data.width, this.data.height);

				for(let i = 0; i < newdata.data.length; i += 4)
				{
					for(let p of palette)
					{
						if(newdata.data[i]   == p[0].r
						&& newdata.data[i+1] == p[0].g
						&& newdata.data[i+2] == p[0].b
						) {
							newdata.data[i]   = p[element+1].r;
							newdata.data[i+1] = p[element+1].g;
							newdata.data[i+2] = p[element+1].b;
						}
					}
				}
				
				canvasCtx.putImageData(newdata, 0, 0);

				let olddata = this.data;
				this.data = canvas;

				if (ig.system.scale != 1) {
					this.resize(ig.system.scale);
				} else {
					this.onresized();
				}
				
				this.elementhairreplacements.push(this.data);
				this.data = olddata;
			}

			parent();
		});
	}
});

ig.Image.inject({
	draw(...args){		
		if(this.elementhairreplacements != null
			&& (this.elementalhairfunc == null || this.elementalhairfunc()))
		{ //if a replaceable file, draw the new one instead, with all the same parameters
			let olddata = this.data;
			let num = elementalhair.GetCharacterElement(this.elementalhaircharacters);
			if (this.elementalnumcolors == 10 && sc.options.get("element-hair-type") == 0)
				num += 5;
			if (this.elementalnumcolors == 1 || sc.options.get("element-hair-type") == 2)
				num = 0;
			this.data = this.elementhairreplacements[num];
			this.parent(...args);
			this.data = olddata;
		}
		else
		{
			this.parent(...args);
		}
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
		if (!(this.runtime.rush && this.runtime.currentRound > 0) && sc.options.get("element-hair-type") != 2)
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
			|| a.name == "hideout/inner-1") //entering the hideout
		{
			if(sc.model && sc.model.player && sc.options.get("element-hair-type") != 2)
				sc.model.player.setElementMode(0, true);
		}
		this.parent(a);
	},
});

ig.DreamFx.inject({
	start(...args){
		if(sc.model && sc.model.player && sc.options.get("element-hair-type") != 2)
			sc.model.player.setElementMode(0, true); //reset element when dreaming (so Lea always logs in with neutral)
		this.parent(...args);
	}
});

sc.ELEMENTAL_HAIR_TYPE = {
    ALL: 0,
    ONLYHAIR: 1,
    NONE: 2
};

let options = {};
for (let [key, value] of Object.entries(sc.OPTIONS_DEFINITION)) {
    options[key] = value;
    switch (key) {
        case "lighting":			
            options["element-hair-type"] = {
				type: 'BUTTON_GROUP',
				cat: sc.OPTION_CATEGORY.VIDEO,
				data: sc.ELEMENTAL_HAIR_TYPE,
				init: 0,
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
