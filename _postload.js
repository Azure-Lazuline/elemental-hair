window.elementalhair = {};
window.elementalhair.files = [];
window.elementalhair.nextId = 0;

elementalhair.AddAsset=function(baseFile, palette, characterList, func, revertIfOff){
	//baseFile = the root image path to replace
	//palette = the palette file to recolor that image with (6 rows, one for the base colors, then neutral heat cold shock and wave
	//characterList = replace the image only for these characters (player, party, or PVP opponent). Can be omitted to make it replace based on the player
	//func = optional. Only replace the image when this evaluates to true
	//revertIfOff = if "true", then reverts to the completely unmodified colors when elemental colors are turned off in the options. Otherwise, uses the "neutral" palette defined in the file. (These are often the same.)
	
	var file = {};
	file.basefile = baseFile;
	file.characterlist = characterList;
	file.func = func;
	file.palettename = palette;
	file.id = window.elementalhair.nextId;
	file.revertifoff = revertIfOff;

	file.elementhairreplacements=[];
	window.elementalhair.nextId++;

	if(file.characterlist != null)
	{
		for(var i=0;i<file.characterlist.length;i++)
			file.characterlist[i]=file.characterlist[i].toLowerCase();
	}

	var img = new ig.Image("media/element-hair/" + palette);
	img.sourceData = file;
	
	const onloadBackup = img.onload.bind(img);
	let resolve;
	file.palette = new Promise(res => (resolve = res));
	img.onload = function() {
		onloadBackup();
		resolve(img);
	}.bind(img);
	
	//console.warn("pushed: " + file.id + " " + Object.entries(file));
	
	window.elementalhair.files.push(file);
	
	if (baseFile == "media/entity/player/move.png") //i missed this one and want it to retroactively apply to recolor mods made after this.
		elementalhair.AddAsset("media/entity/npc/captain.png", palette, characterList, func, revertIfOff); //in hindsight i should've done similar "auto-batching" for more stuff
};

elementalhair.GetCharacterElement=function(characterlist){
	if (characterlist == null) 
		return this.playerElement;
	if (sc.model && sc.model.player && characterlist.includes(sc.model.player.name.toLowerCase()))
		return this.playerElement;
	
	if (elementalhair.hasPartyElementEffects && sc.options.get("element-hair-party"))
	{
		for(var i=0;i<2;i++)
		{
			var partymember = sc.party.getPartyMemberEntityByIndex(i);
			
			//if (partymember != null && partymember.model != null) console.warn(partymember.model.name);
			
			if (partymember != null && partymember.model != null && characterlist.includes(partymember.model.name.toLowerCase()))
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
				if (sc.pvp.enemies[i].enemyNameNoDir == null)
				{
					var lastdir = sc.pvp.enemies[i].enemyName.lastIndexOf(".");
					if (lastdir >= 0)
						sc.pvp.enemies[i].enemyNameNoDir = sc.pvp.enemies[i].enemyName.substring(lastdir + 1);
					else
						sc.pvp.enemies[i].enemyNameNoDir = sc.pvp.enemies[i].enemyName;
					
					sc.pvp.enemies[i].enemyNameNoDir = sc.pvp.enemies[i].enemyNameNoDir.toLowerCase();
				}
				if (characterlist.includes(sc.pvp.enemies[i].enemyNameNoDir))
					return sc.pvp.enemies[i].elementModes.current;
				//if(Math.random() < 0.05) console.warn(sc.pvp.enemies[i].enemyName + ": " + sc.pvp.enemies[i].elementModes.current);
				//enemies[i]: party,2,aggression,0,enemyName,avatar.apollo-4,enemyType,[object Object],enemyGroup,,defeatVarIncrease,,enemyTypeInitialized,true,dropHealOrb,0,hpAttached,[object Object],spawnPoint,[object Object],currentState,ATTACK,postStun,[object Object],nextState,,nextTimerChange,[object Object],stateTimers,[object Object],trackers,[object Object],deferredPerformedConds,,targetLoseTimer,0,reactions,[object Object],dodge,[object Object],annotate,[object Object],hpBreakReached,0,lastPoICheck,,targetFixed,false,collaboration,,collabAttribs,,elementModes,[object Object],storedEnemies,,ownerEnemy,,cameraZFocus,0,startEffect,,targetOnSpawn,false,boosterState,0,level,[object Object],visibility,[object Object],_wm,[object Object],classId,1226,params,[object Object],isCombatant,true,material,2,damageTimer,0,defeatNotified,false,dying,0,skipRumble,false,deathEffect,,manualKill,,invincibleTimer,0,stunThreshold,0,stunCombatant,,stunSteps,,stunData,[object Object],targetedBy,,threat,,regenFactor,0,regenTimer,0,walkAnims,[object Object],hitStable,3,hitIgnore,false,statusGui,[object Object],shieldsConnections,,spikeDmg,[object Object],pvp,[object Object],respawn,[object Object],effects,[object Object],tackle,[object Object],combo,[object Object],target,[object Object],tmpTarget,,replaceTargets,,ignoreTaunts,false,soundType,default,dustType,1,stepFx,[object Object],nav,[object Object],tooHighToFall,false,stepStats,[object Object],influencer,[object Object],onMoveEffect,,animSheet,[object Object],face,[object Object],currentAnim,spinShortRev,followUpAnim,meleeEndRev,faceDirFixed,false,forceFaceDirFixed,true,animationFixed,true,floatHeightOnMove,0,fly,[object Object],walkAnimsName,normal,storedWalkAnims,[object Object],currentAction,[object Object],currentActionStep,[object Object],stepTimer,0.1290000000000005,stepSync,0,stepData,[object Object],keepStateAfterAction,false,inlineActionStack,,stashed,[object Object],defaultConfig,[object Object],jumpingEnabled,true,jumping,false,floatJump,0,preJumpStats,[object Object],actionAttached,[object Object],[object Object],attributes,[object Object],faceToTarget,[object Object],animState,[object Object],animSpeedFactor,1,callbackOnFinish,,_createdAnimSheet,false,id,300,uid,677,mapId,331,settings,[object Object],name,lily,coll,[object Object],sprites,[object Object],entityAttached,[object Object],_hidden,false,_hideRequest,false,_killed,false,parent,,dmgZFocus,0,proxies,[object Object],justEnteredState,false,elementFilter,0,fallDmgFactor,0.1,difficultyModsScaledHP,1.3,secondJumpCheck,false
				//enemies[i].enemyType: cacheKey,avatar.apollo-4,cacheType,Enemy,aiGroup,,aiLearnType,[object Object],enduranceScale,1,name,,params,[object Object],credit,0,exp,1000,level,70,maxSp,16,boss,false,hpBreaks,,hpBreakCond,true,animSheet,[object Object],attribs,[object Object],proxies,[object Object],actions,[object Object],states,[object Object],reactions,[object Object],trackerDef,[object Object],headIdx,4,healDropRate,0,itemDrops,,targetDetect,[object Object],classId,249,loaded,true,failed,false,path,avatar.apollo-4,tolerateMissingResources,false,loadListeners,,loadCollectors,,referenceCount,1,emptyMapChangeCount,0,parent,,loadCallback,,bossLabel,Boss,bossOrder,0,detectType,1,boostedLevel,60,ignoreTaunts,false,elementModes,[object Object],modifiers,[object Object],size,[object Object],cameraZFocus,0,dmgZFocus,0,padding,[object Object],walkConfigs,[object Object],material,2,entityConfig,[object Object],defaultState,DEFAULT
				//console.warn(Object.entries(sc.pvp.enemies[i].elementModes.current));
			}
		}
	}
	
	return 0;
};

ig.Image.inject({
	onload(){
		var path2 = this.path.trim();
		var replacementfiles = [];
		for (var d=0; d<window.elementalhair.files.length; d++)
		{
			if (window.elementalhair.files[d].basefile == path2)
				replacementfiles.push(window.elementalhair.files[d]);
		}
		
		if (replacementfiles.length > 0)
		{			
			//console.warn(replacementfiles.length + " files for " + path2);
			var filestemp = [];
			var promises = [];
			for (var file of replacementfiles)
			{
				const file2 = file;
				promises.push(file2.palette.then(paletteimg => {
					//console.warn("modifying " + file2.basefile + " with " + file2.palettename);
					file2.elementalnumcolors=paletteimg.data.height - 1;
					if (file2.elementalnumcolors != 1 && file2.elementalnumcolors != 5 && file2.elementalnumcolors != 10)
					{
						console.error(paletteimg.path + ": Elemental hair palette image must be 2 or 6 pixels tall.");
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
						for(let y=0;y<=file2.elementalnumcolors;y++){
							let i=(y*paletteimg.data.width + x) * 4;
							colors.push({r:palettedata.data[i+0],g:palettedata.data[i+1],b:palettedata.data[i+2]});
						}
						palette.push(colors);
					}

					//make the new recolors, one per element (plus neutral so you can use this as a general recoloring thing if you want)
					for(let element=0;element<file2.elementalnumcolors;element++)
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
						file2.elementhairreplacements.push(canvas);
					}
					filestemp.push(file2);
					//console.warn("done " + file2.basefile + " with " + file2.palettename);
					
				}));
			}
			const parent = this.parent.bind(this);
			var img = this;
			//console.warn("waiting");
			Promise.all(promises).then(function()
			{
				//console.warn("finalizing start");
				img.elementalhairfiles = [];
				for (var c=0;c<window.elementalhair.files.length;c++)
				{ //sort them in the same order as they were added, since promises go in a random order
					for (var k=0;k<filestemp.length;k++)
					{
						if (filestemp[k].id == window.elementalhair.files[c].id)
						{
							//console.warn(img.elementalhairfiles.length + "f: " + files
							img.elementalhairfiles.push(filestemp[k]);
						}
					}
				}
				parent();
				//console.warn("finalizing done");
			});
		}
		else
		{
			this.parent();
		}
	}
});

//main function, run once
{
	elementalhair.playerElement = 0;
	elementalhair.hasPartyElementEffects = window.activeMods.find(e => e.name === "party-element-effects") != null;
	
	//a note for modders: all these are in postload, but you should add yours in prestart so it loads after this.
	//that means it's guaranteed for all the relevant code to be loaded first, and yours will have priority over these if they apply to the same file.
	//you can add your own lines similar to the ones below, and make sure to check "for-modders.txt" for extra tricks and details!

	//------------------
	//-   Main stuff   -
	//------------------
	elementalhair.AddAsset("media/entity/player/move.png", "lea-palette.png");
	elementalhair.AddAsset("media/entity/player/throw.png", "lea-palette.png");
	elementalhair.AddAsset("media/entity/player/move-weak.png", "lea-palette.png");
	elementalhair.AddAsset("media/entity/player/hugging.png", "lea-palette.png");
	elementalhair.AddAsset("media/entity/player/poses.png", "lea-palette.png");
	elementalhair.AddAsset("media/entity/player/poses-shizuka.png", "lea-palette.png");
	elementalhair.AddAsset("media/entity/player/sleeping.png", "lea-palette.png");
	elementalhair.AddAsset("media/entity/player/special.png", "lea-palette.png");
	elementalhair.AddAsset("media/map/baked/lea-bakii-kum.png", "lea-palette.png");
	elementalhair.AddAsset("media/map/baked/lea-ctron-bakii-kum.png", "lea-palette.png");
	elementalhair.AddAsset("media/map/baked/lea-server.png", "lea-palette.png");
	elementalhair.AddAsset("media/map/baked/tree-top-ctron.png", "lea-palette.png");
	elementalhair.AddAsset("media/gui/menu.png", "lea-dialogue-palette.png", null, function(){ return !sc.options.get("element-hair-auto-neutral"); });
	elementalhair.AddAsset("media/face/lea.png", "lea-dialogue-palette.png");
	elementalhair.AddAsset("media/face/lea-hand.png", "lea-dialogue-palette.png");
	elementalhair.AddAsset("media/face/lea-panic.png", "lea-dialogue-palette.png");
	elementalhair.AddAsset("media/face/lea-special.png", "lea-dialogue-palette.png");
	elementalhair.AddAsset("media/parallax/end-bbq/front.png", "lea-dialogue-palette.png");
	elementalhair.AddAsset("media/parallax/tower/1-lea.png", "lea-dialogue-palette.png");
	elementalhair.AddAsset("media/parallax/title/lea.png", "lea-dialogue-palette.png"); //did you know going back to the title screen will show it with your last element?

	var shizukaenabled = function(){ return (sc.options.get("element-hair-party") || sc.model.player.name == "Shizuka0") && !elementalhair.leaPettingShizuka; };
	elementalhair.AddAsset("media/entity/player/move-shizuka.png", "shizuka-palette.png", ["Shizuka", "Shizuka0"], shizukaenabled);
	elementalhair.AddAsset("media/entity/player/throw-shizuka.png", "shizuka-palette.png", ["Shizuka", "Shizuka0"], shizukaenabled);
	elementalhair.AddAsset("media/entity/player/poses-shizuka.png", "shizuka-palette.png", ["Shizuka", "Shizuka0"], shizukaenabled);
	elementalhair.AddAsset("media/entity/player/shizuka-special.png", "shizuka-palette.png", ["Shizuka", "Shizuka0"], shizukaenabled);
	elementalhair.AddAsset("media/face/shizuka.png", "shizuka-dialogue-palette.png", ["Shizuka", "Shizuka0"], function(){ return sc.model.player.name == "Shizuka0"; });

	elementalhair.AddAsset("media/entity/npc/emilie.png", "emilie-palette.png", ["Emilie"]);
	elementalhair.AddAsset("media/entity/npc/emilie-attack.png", "emilie-palette.png", ["Emilie"]);
	elementalhair.AddAsset("media/entity/npc/glasses.png", "ctron-palette.png", ["Glasses"]);
	elementalhair.AddAsset("media/entity/npc/schneider.png", "lukas-palette.png", ["Schneider", "Schneider2", "Lukas"]);
	elementalhair.AddAsset("media/entity/npc/luke.png", "lukas-palette.png", ["Luke"]);
	elementalhair.AddAsset("media/entity/npc/fancyguy.png", "apollo-palette.png", ["Apollo", "apollo-2", "apollo-3", "apollo-4"]);
	elementalhair.AddAsset("media/entity/npc/sidekick.png", "joern-palette.png", ["Joern"]);

	elementalhair.AddAsset("media/entity/npc/guest/lily.png", "lily-palette.png", ["lily"]);

	//-----------------
	//-   XPC stuff   -
	//-----------------
	elementalhair.AddAsset("media/entity/npc/lea-hexa.png", "lea-palette.png");
	elementalhair.AddAsset("media/entity/npc/lea-tri.png", "lea-palette.png");
	elementalhair.AddAsset("media/entity/npc/schneiderEatFix.png", "lukas-palette.png", ["Schneider", "Schneider2", "Lukas"]);
	elementalhair.AddAsset("media/entity/npc/lukeEatFix.png", "lukas-palette.png", ["Luke"]);

	elementalhair.AddAsset("media/entity/npc/triblader-lea.png", "triblader-lea-palette.png");
	elementalhair.AddAsset("media/entity/npc/triblader-lea-extra.png", "triblader-lea-palette.png");

	var unlockedAnyElement = function(){ return elementalhair.unlockedAnyElement; }
	
	elementalhair.AddAsset("media/entity/npc/triblader2.png", "xpc-triblader2-palette.png", ["triblader2", "triblader2-freq-arts"], unlockedAnyElement, true);
	elementalhair.AddAsset("media/entity/npc/triblader2-extra.png", "xpc-triblader2-palette.png", ["triblader2", "triblader2-freq-arts"], unlockedAnyElement, true);
	elementalhair.AddAsset("media/entity/npc/triblader3.png", "xpc-triblader3-palette.png", ["triblader3"], unlockedAnyElement, true);
	elementalhair.AddAsset("media/entity/npc/triblader3-extra.png", "xpc-triblader3-palette.png", ["triblader3"], unlockedAnyElement, true);
	elementalhair.AddAsset("media/entity/npc/triblader4.png", "xpc-triblader4-palette.png", ["triblader4"], unlockedAnyElement, true);
	elementalhair.AddAsset("media/entity/npc/triblader4-extra.png", "xpc-triblader4-palette.png", ["triblader4"], unlockedAnyElement, true);
	elementalhair.AddAsset("media/entity/npc/triblader5.png", "xpc-triblader5-palette.png", ["triblader5"], unlockedAnyElement, true);
	elementalhair.AddAsset("media/entity/npc/triblader5-extra.png", "xpc-triblader5-palette.png", ["triblader5"], unlockedAnyElement, true);

	elementalhair.AddAsset("media/entity/npc/hexacast1.png", "xpc-hexacast-palette.png", ["hexacast1"], unlockedAnyElement, true);
	elementalhair.AddAsset("media/entity/npc/hexacast1-sphero.png", "xpc-hexacast-palette.png", ["hexacast1"], unlockedAnyElement, true);
	elementalhair.AddAsset("media/entity/npc/hexacast1-sweeps.png", "xpc-hexacast-palette.png", ["hexacast1"], unlockedAnyElement, true);
	elementalhair.AddAsset("media/entity/npc/hexacast1-triblader.png", "xpc-hexacast-palette.png", ["hexacast1"], unlockedAnyElement, true);
	elementalhair.AddAsset("media/entity/npc/hexacast2.png", "xpc-hexacast-palette.png", ["hexacast2"], unlockedAnyElement, true);
	elementalhair.AddAsset("media/entity/npc/hexacast2-sphero.png", "xpc-hexacast-palette.png", ["hexacast2"], unlockedAnyElement, true);
	elementalhair.AddAsset("media/entity/npc/hexacast2-sweeps.png", "xpc-hexacast-palette.png", ["hexacast2"], unlockedAnyElement, true);
	elementalhair.AddAsset("media/entity/npc/hexacast2-triblader.png", "xpc-hexacast-palette.png", ["hexacast2"], unlockedAnyElement, true);

	var isTribladerLea = function(){ return sc.model.player.name == "triblader-lea"; };
	elementalhair.AddAsset("media/entity/player/move-weak.png", "triblader-lea-palette.png", null, isTribladerLea);
	elementalhair.AddAsset("media/entity/player/hugging.png", "triblader-lea-palette.png", null, isTribladerLea);
	elementalhair.AddAsset("media/entity/player/poses.png", "triblader-lea-palette.png", null, isTribladerLea);
	elementalhair.AddAsset("media/entity/player/poses-shizuka.png", "triblader-lea-palette.png", null, isTribladerLea);
	elementalhair.AddAsset("media/entity/player/sleeping.png", "triblader-lea-palette.png", null, isTribladerLea);
	elementalhair.AddAsset("media/entity/player/special.png", "triblader-lea-palette.png", null, isTribladerLea);
	elementalhair.AddAsset("media/map/baked/lea-bakii-kum.png", "triblader-lea-palette.png", null, isTribladerLea);
	elementalhair.AddAsset("media/map/baked/lea-ctron-bakii-kum.png", "triblader-lea-palette.png", null, isTribladerLea);
	elementalhair.AddAsset("media/map/baked/lea-server.png", "triblader-lea-palette.png", null, isTribladerLea);
	elementalhair.AddAsset("media/map/baked/tree-top-ctron.png", "triblader-lea-palette.png", null, isTribladerLea);
	elementalhair.AddAsset("media/gui/menu.png", "triblader-lea-dialogue-palette.png", null, isTribladerLea);
	elementalhair.AddAsset("media/face/lea.png", "triblader-lea-dialogue-palette.png", null, isTribladerLea);
	elementalhair.AddAsset("media/face/lea-hand.png", "triblader-lea-dialogue-palette.png", null, isTribladerLea);
	elementalhair.AddAsset("media/face/lea-panic.png", "triblader-lea-dialogue-palette.png", null, isTribladerLea);
	elementalhair.AddAsset("media/face/lea-special.png", "triblader-lea-dialogue-palette.png", null, isTribladerLea);
	elementalhair.AddAsset("media/parallax/end-bbq/front.png", "triblader-lea-dialogue-palette.png", null, isTribladerLea);
	elementalhair.AddAsset("media/parallax/tower/1-lea.png", "triblader-lea-dialogue-palette.png", null, isTribladerLea);
	elementalhair.AddAsset("media/parallax/title/lea.png", "triblader-lea-dialogue-palette.png", null, isTribladerLea);

}