window.elementalhair = {};

elementalhair.AddAsset=function(basefile, palette, func){
	//basefile = the root image path to replace
	//palette = the palette file to recolor that image with (6 rows, one for the base colors, then neutral heat cold shock and wave
	//func = optional. Only replace the image when this evaluates to true
	
	const img = new ig.Image("media/element-hair/" + palette);
	elementalhair.funcs[basefile] = func;

	const onloadBackup = img.onload.bind(img);
	let resolve;
	elementalhair.palettes[basefile] = new Promise(res => (resolve = res));
	img.onload = function() {
		onloadBackup();
		resolve(img);
	}.bind(img);
}

//main function, run once
{
	elementalhair.currentElement = 0;
	elementalhair.palettes = {};
	elementalhair.funcs = {};

	elementalhair.AddAsset("media/entity/player/move.png", "lea-palette.png");
	elementalhair.AddAsset("media/entity/player/throw.png", "lea-palette.png");
	elementalhair.AddAsset("media/entity/player/move-weak.png", "lea-palette.png");
	elementalhair.AddAsset("media/entity/player/hugging.png", "lea-palette.png");
	elementalhair.AddAsset("media/entity/player/poses.png", "lea-palette.png");
	elementalhair.AddAsset("media/entity/player/sleeping.png", "lea-palette.png");
	elementalhair.AddAsset("media/entity/player/special.png", "lea-palette.png");
	elementalhair.AddAsset("media/gui/menu.png", "lea-dialogue-palette.png");
	elementalhair.AddAsset("media/face/lea.png", "lea-dialogue-palette.png");
	elementalhair.AddAsset("media/face/lea-hand.png", "lea-dialogue-palette.png");
	elementalhair.AddAsset("media/face/lea-panic.png", "lea-dialogue-palette.png");
	elementalhair.AddAsset("media/face/lea-special.png", "lea-dialogue-palette.png");

	elementalhair.AddAsset("media/entity/player/move-shizuka.png", "shizuka-palette.png", function(){ return sc.model.player.name == "Shizuka0"; });
	elementalhair.AddAsset("media/entity/player/throw-shizuka.png", "shizuka-palette.png",  function(){ return sc.model.player.name == "Shizuka0"; });
	elementalhair.AddAsset("media/entity/player/poses-shizuka.png", "shizuka-palette.png",  function(){ return sc.model.player.name == "Shizuka0"; });
	elementalhair.AddAsset("media/entity/player/shizuka-special.png", "shizuka-palette.png", function(){ return sc.model.player.name == "Shizuka0"; });
	elementalhair.AddAsset("media/face/shizuka.png", "shizuka-dialogue-palette.png", function(){ return sc.model.player.name == "Shizuka0"; });
}
ig.Image.inject({
	onload(){
		if(elementalhair.palettes[this.path] == null) return this.parent();

		this.elementalhairfunc = elementalhair.funcs[this.path];

		const parent = this.parent.bind(this);
		// wait for the palette to be loaded
		elementalhair.palettes[this.path].then(paletteimg => {
			let palettecanvas = ig.$new("canvas");
			palettecanvas.width = paletteimg.data.width;
			palettecanvas.height = paletteimg.data.height;
						
			let paletteCanvasCtx = ig.system.getBufferContext(palettecanvas);
			paletteCanvasCtx.drawImage(paletteimg.data, 0, 0, paletteimg.data.width, paletteimg.data.height);
			let palettedata = paletteCanvasCtx.getImageData(0, 0, paletteimg.data.width, paletteimg.data.height);
			
			let palette=[];
			for(let x=0;x<paletteimg.data.width;x++){
				let colors=[];
				for(let y=0;y<=5;y++){
					let i=(y*paletteimg.data.width + x) * 4;
					colors.push({r:palettedata.data[i+0],g:palettedata.data[i+1],b:palettedata.data[i+2]});
				}
				palette.push(colors);
			}

			//make the new recolors, one per element (plus neutral so you can use this as a general recoloring thing if you want)
			this.elementhairreplacements=[];
			for(let element=0;element<5;element++)
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
		if(this.elementhairreplacements != null && sc.options.get("element-hair-enable")
			&& (this.elementalhairfunc == null || this.elementalhairfunc()))
		{ //if a replaceable file, draw the new one instead, with all the same parameters
			let olddata = this.data;
			this.data = this.elementhairreplacements[elementalhair.currentElement];
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

	  elementalhair.currentElement = this.model.currentElementMode;

      return this.parent(...args);
  },
});

ig.MessageAreaGui.inject({
  modelChanged(a, d, c) {
	  if(d == sc.MESSAGE_EVENT.PERSON_ADDED)
	  {
		  if(c == "main.lea" && sc.model.player.currentElementMode != 0 && sc.options.get("element-hair-auto-neutral"))
		  { //swap to neutral so the portrait matches
				sc.model.player.setElementMode(0, true);
				elementalhair.currentElement = 0; //set the displayed color to neutral even when in pause menu cutscenes where player.update doesn't run
		  }
	  }
      this.parent(a, d, c);
  },
});

sc.Arena.inject({
  enterArenaMode(...args) {
	
	//the game already snaps you to neutral with no effect on the first frame the fight begins which is awkward, so i do it ahead of time
	if(sc.options.get("element-hair-enable"))
	{
		sc.model.player.setElementMode(0, true);
	}
	
	this.parent(...args);
  },
});

ig.ENTITY.Door.inject({
	open(a, d){
		if(this.map == "hideout.inner-1" && sc.model.player.name == "Shizuka0"
			&& sc.options.get("element-hair-enable"))
		{ //set Shizuka to neutral upon entering the hideout in the intro so the cutscene shows normal colors
			sc.model.player.setElementMode(0, true);			
		}
		this.parent(a, d);
	},
});

let options = {};
for (let [key, value] of Object.entries(sc.OPTIONS_DEFINITION)) {
    options[key] = value;
    switch (key) {
        case "lighting":
            options["element-hair-enable"] = {
				type: 'CHECKBOX',
				cat: sc.OPTION_CATEGORY.VIDEO,
				init: true,
				fill: true,
				showPercentage: true,
				hasDivider: true,
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
