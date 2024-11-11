# elemental-hair

![](https://github.com/Azure-Lazuline/elemental-hair/blob/main/screenshots/banner.png?raw=true)

![](https://github.com/Azure-Lazuline/elemental-hair/blob/main/screenshots/screen1.png?raw=true)

Fixes the greatest flaw in CrossCode by giving Lea different hair colors when you switch elements. If you have the [Party Elemental Effects](https://github.com/XenonA7/party-element-effects) mod installed then this can apply to party members and PVP opponents too.

There's a few toggles in the options menu (under "Video"), like automatically swapping back to neutral when a cutscene starts.

### Customization

If you want to modify this for your own custom palettes, you can just change the palette files in `assets/media/element-hair`. The first line is reference colors, and the next 5 lines are for neutral, heat, cold, shock, and wave. (Some files have 5 more lines; those are the five palettes for if you have "hair+armor" selected instead of just hair. You can trim it down to just the normal ones if you want.) You can check the psd files for easy gradient editing and to see it applied to the sprites as you go!

I've included **boki-colors.zip** as an example mod for if you don't want to overwrite this mod's files. It replaces Lea's colors with Boki's from Copy Kitty, based on a few of the weapon palettes there. It  also adds a little extra thing somewhere...

This system is pretty easy to extend for your own custom characters, or to palette-swap other things.

### Installation

To use, install [ccloader](https://github.com/CCDirectLink/CCLoader), and go to the "Mods" menu ingame (the button at the *top* of the Options menu, not the tab on the right) and it should be listed there to select and install. You should grab "Party Elemental Effects" there too.

You can also install manually by placing [the .ccmod file](https://github.com/Azure-Lazuline/elemental-hair/releases) in your ccloader mods folder.
