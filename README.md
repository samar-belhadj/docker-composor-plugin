# leto-modelizer-plugin-template

This project is a template to help you write your own plugin.

You can find in all js objects in `src` an explanation of what you have to do.

## Update your package.json

In `package.json` and in this project we provide you with many thing to start your plugin development:
- Setup jest for unit test.
- Setup eslint with AirBnB syntax.
- Setup the build command.

Feel free to pick and choose from those base settings.

But before starting to develop your plugin you have to modify some properties of your `package.json` :

- `name`: put your plugin name here.
- `version`: we set the template version here, but you have to set your plugin version instead.
- `description`: explain what your plugin does.
- `repository`: update with your repository values.
- `keywords`: Your keywords that describe your plugin.
- `author`: put the name and email of your maintainer for your plugin.
- `bugs` / `homepage`: update with your repository url.
- `main` / `exports`:  correspond to your build file that would be used by other

Don't forget to regenerate the `package-lock.json` with this command `npm i --package-lock-only`.

Don't forget to modify the `jsdoc.config.js` to set your wanted plugin name and url.

Don't forget to modify the `webpack.config.js` to set your wanted export file name.

We provide a `changelog.json` to explain all change in the template, you can remove it and have your own changelog file.

## Name your plugin

By default, in this template we use "MyPlugin" as your plugin name.

So once your plugin's name is chosen, you have to make these modifications:

* Rename these files and their content:
  * `src/draw/MyPluginDrawer.js`
  * `src/metadata/MyPluginMetadata.js`
  * `src/parser/MyPluginParser.js`
  * `src/render/MyPluginRenderer.js`
  * `src/models/MyPlugin.js`
* Change the content of `src/index.js`

Example: You want to name your plugin `Fruit`

`src/draw/MyPluginDrawer.js` becomes `src/draw/FruitDrawer.js`
```js
import { DefaultDrawer } from 'leto-modelizer-plugin-core';

class FruitDrawer extends DefaultDrawer {}

export default FruitDrawer;
```

Do the same thing for `MyPluginMetadata`, `MyPluginParse` and `MyPluginRenderer`.

Content of `src/models/MyPlugin.js` becomes:
```js
import {
  DefaultPlugin,
  DefaultData,
} from 'leto-modelizer-plugin-core';
import FruitDrawer from 'src/draw/FruitDrawer';
import FruitMetadata from 'src/metadata/FruitMetadata';
import FruitParser from 'src/parser/FruitParser';
import FruitRenderer from 'src/render/FruitRenderer';
import { name, version } from 'package.json';

/**
 * My fruit plugin.
 */
class FruitPlugin extends DefaultPlugin {
  /**
   * Default constructor.
   */
  constructor() {
    const pluginData = new DefaultData({
      name,
      version,
    });

    super({
      pluginData,
      pluginDrawer: new FruitDrawer(pluginData),
      pluginMetadata: new FruitMetadata(pluginData),
      pluginParser: new FruitParser(pluginData),
      pluginRenderer: new FruitRenderer(pluginData),
    });
  }
}

export default FruitPlugin;
```

Content of `src/index.js` becomes:
```js
import FruitPlugin from 'src/models/FruitPlugin';

export default FruitPlugin;
```

## Write your metadata

To make your plugin work we need to have an array of [ComponentDefinitions](https://github.com/ditrit/leto-modelizer-plugin-core/blob/0.2.0/src/models/ComponentDefinition.js).

The [DefaultMetadata](https://github.com/ditrit/leto-modelizer-plugin-core/blob/0.2.0/src/metadata/DefaultMetadata.js) provides two methods:
* `validate` to validate the metadata
* `parse` to set all ComponentDefinitions in pluginData from your provided metadata

To keep our previous example, we can have 4 ComponentDefinitions for our `FruitPlugin`:
- `Bag`, it's a bag that can contains fruits. It has only one mandatory attribute, its `maxSize` that represent the maximum of fruit it can carry.
- `Fruit`, it's a simple fruit. Its only mandatory attribute is `name`.

in this example, we don't want to parse and validate a metadata file.

But you can find an implementation example [here](https://github.com/ditrit/iactor/tree/dev/src/metadata) which can validate and get definitions from [this metadata](https://github.com/ditrit/iactor/blob/dev/tests/metadata/aws.json).  

So, here is our `FruitMetadata` class: 
```js
import {
  DefaultMetadata,
  ComponentDefinition,
} from 'leto-modelizer-plugin-core';

class FruitMetadata extends DefaultMetadata {
  parse() {
    const bagDefinition = new ComponentDefinition('bag');
    bagDefinition.definedAttributes.push(new ComponentAttributeDefinition(
      'maxSize', // Attribute name
      'Number',  // Attribute type
      [],
      true, // is required
    ));
    bagDefinition.isContainer = true;
    
    const fruitDefinition = new ComponentDefinition('fruit');
    fruitDefinition.definedAttributes.push(new ComponentAttributeDefinition(
      'name',   // Attribute name
      'String', // Attribute type
    ));
    
    this.pluginData.definitions.components = [bagDefinition, fruitDefinition];
  }
}

export default FruitMetadata;
```

## Write your parser

You have to implement you own parser to manage the file formats you want.

`MyPluginParser` has only two methods to implement:
- `isParsable(fileName): Boolean`, to indicate if the provided fileName has to be parsed.
- `parse(inputs[])`, to parse an array of file input and retrieve all the corresponding components.

The parse method updates the `this.pluginData.components` and `this.pluginData.parseErrors`.

You can use any library you want to parse all the files. For your information, we use [Antlr](https://www.antlr.org/) for our terraform parser.

### Manage the parser errors  

On LetoModelizer we use Monaco editor. We design our ParseError class to make all errors usable by MonacoEditor.

So, when your parser throws|returns a parsing error, you should provide all errors positions. Leto-Modeliser has the ability to
display correctly those errors in the monaco editor.

## Write your renderer

You have to implement you own renderer to transform all components and links in your wanted files.

Method to implements: `parse()`

## Customize your drawer models

By default, we provide a default icon and model for the drawer.

If you don't want to use them, feel free to override them with your svg.

But for model, if you want the drawer to set the default values on it, you have to set:
- an attribute `id`: to set the default id of your component.
- an attribute `x`: to set the default x position of your component.
- an attribute `y`: to set the default y position of your component.
- a class `.component-name`: to set the component name as text
- a class `.component-type`: to set the component type as text

### Use custom model in drawer

You can provide multiple models and icons that can be used by the drawer.

To do that, you have to add the svg of your icons in the folder `public/icons` and the svg of your
models in the folder `public/models`.

Take care of the model name, it will be used by the specific method called in drawer.

Example:

Add a model `MyFruitModel.svg` in `public/models` and an icon `banana.svg` in `public/icons`.

You have to set in one or more ComponentDefinition the property:
- `model` with the value `MyFruitModel`, to indicate to the drawer which model it has to use.
- `icon` with the value `banana`, to indicate to the drawer which icon it has to use. 

## Build your plugin

You can build your plugin with this command:

```
npm run build
```
