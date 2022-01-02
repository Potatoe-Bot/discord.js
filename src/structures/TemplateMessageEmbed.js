'use strict';

const MessageEmbed = require('./MessageEmbed.js');
function replace(string, data) {
  // Case 1: return non string values
  if (/^{\w+}$/.exec(string)) {
    return data[/^!{(\w+)}$/.exec(string)[1]] || null;
  }
  // Case 2: return portion of string;
  return string.replace(/{([^}]+)}/g, (_, attrib) => data[attrib] || `{${attrib}}`);
}
/**
 * Represents a template embed that can be rendered with data;
 */
class TemplateMessageEmbed extends MessageEmbed {
  /**
   * @param {MessageEmbed|MessageEmbedOptions|APIEmbed} [data={}] MessageEmbed to clone or raw embed data
   */
  constructor(data) {
    super(data, true);
  }
  /**
   * Sets the color of this embed.
   * @param {ColorResolvable} color The color of the embed
   * @returns {MessageEmbed}
   */
  setColor(color) {
    this._color = color;
    return this;
  }
  /**
   * Renders the embed template with the desired data
   * @param {Object} data The data that the embed should be rendered with
   * @returns {MessageEmbed}
   */
  render(data) {
    let copy = new MessageEmbed(this);
    if (copy.title) {
      copy.title = replace(copy.title, data);
    }
    if (copy.description) {
      copy.description = replace(copy.description, data);
    }
    if (copy.url) {
      copy.url = replace(copy.url, data);
    }
    if (copy.footer?.text) {
      copy.footer.text = replace(copy.footer.text, data);
    }
    if (copy.fields) {
      for (const field of copy.fields) {
        field.name = replace(field.name, data);
        field.value = replace(field.value, data);
      }
    }
    if (copy.image?.url) {
      copy.image.url = replace(copy.image.url, data);
    }
    if (copy.image?.proxyURL) {
      copy.image.proxyURL = replace(copy.image.proxyURL, data);
    }
    if (this._color) {
      console.log(replace(this._color, data));
      copy.setColor(replace(this._color, data));
    }
    return copy;
  }
}
module.exports = TemplateMessageEmbed;
