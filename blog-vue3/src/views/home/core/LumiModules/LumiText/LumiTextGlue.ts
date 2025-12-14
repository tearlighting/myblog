import type { LumiText } from "./LumiText"

export class LumiTextGlue {
  constructor(private title: LumiText, private description: LumiText) {}
  entry() {
    this.title.enter()
    this.description.enter()
  }
  exit() {
    this.title.exit()
    this.description.exit()
  }
}
