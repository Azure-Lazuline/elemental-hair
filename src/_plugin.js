export default class {
  constructor(mod) {
    this.mod = mod;
  }

  postload() {
    if (sc.azuhair == null) sc.azuhair = {};
    sc.azuhair.mod = this.mod;

    let title = null;

    if (this.mod.manifest != null) {
      let titleMaybeLocalized = this.mod.manifest.title;
      title =
        typeof titleMaybeLocalized === 'object' && titleMaybeLocalized != null
          ? titleMaybeLocalized.en_US
          : titleMaybeLocalized;
    } else if (this.mod.displayName != null) {
      title = this.mod.displayName;
    }

    if (title != null && typeof title === 'string' && title.length > 0) {
      sc.azuhair.modName = title;
    } else {
      sc.azuhair.modName = this.mod.id;
    }
  }
}
