# The IGG Awards - Summer 2026
<img src="/static/site-assets/pats-poster-1.png" align="left" alt="The IGG Awards, hosted by Kreekcraft, special guest Strofix" width="300">

**This.** is the igg awards.

<br clear="left"/>

## Adding awards
### Whats a ballot
Every page that contains awards is called a ballot.

Theyre defined in `ballots/[ballot-name].json` files, which lays out the name of the ballot, where to get its assets (images, videos etc.) and the award categories.
### Editing ballots
You can edit and add ballots by going to [/src/lib/ballots](https://github.com/nisiosh/igg-awards-s26/tree/main/src/lib/ballots). 

This is what a basic ballot looks like
```json
{
    "name": "Gastropolis Awards",
    "assetPath": "minecraft",
    "categories": [ ]
}
```

* `name` - the name of the ballot.
* `assetPath` - where to get their images from, relative to [/static/nominee-assets](https://github.com/nisiosh/igg-awards-s26/tree/main/static/nominee-assets)
* `categories` - the list of awards.

### Categories
The `categories` section of the ballot is where every award is defined. It has to start and end with square brackets (`[]`) which lets json know its a list.

Heres a minecraft award example
```json
{
    "title": "Best View",
    "options": [
        {
            "name": "Circle K Tower Business Room",
            "creator": "Pat",
            "asset": "best-place-faded/circle-k-tower-stocks.jpeg"
        },
        {
            "name": "IGG Towers Penthouse Balcony",
            "creator": "Shan",
            "asset": "best-place-faded/igg-tower-top.jpeg"
        },
        {
            "name": "IGG Gaff Balcony",
            "creator": "Liam, Dima, Shan, Pat, Kingers",
            "asset": "best-place-faded/igg-gaff-balcony.jpeg"
        }
    ]
}
```
It can look pretty complicated if youre not used to json files, but it can all be broken down into smaller parts

It starts and ends with `{}` (curly brackets) letting json know that its a new award
 * `title` - The name of the category
 * `subtitle` - Optional, text that appears underneath the title
 * `options` - Another list using square brackets which contains every nominee for the award. 
    Every option has the following
    * `name` - The name of the nominated thing
    * `creator` - Whoever created it. You don't need this if the nominated thing is a person, it will still work.
    * `asset` - The file path to whatever asset you are using. It can be an image, `.mp4` file (video), or `.trim.json` file which well get into in a bith.<br /><br />
    The file path is based on the `assetPath` defined at the start of the ballot file.<br />If the asset path is `minecraft` and the asset is `best-place-faded/igg-gaff-balcony.jpeg` then the full path would be<br />
    `/static/nominee-assets/**minecraft**/**best-place-faded/igg-gaff-balcony.jpeg**`

    * It has to end in a `,` if you're adding another nominee, but it **can't end in `,` if its the last nominee in the category.**


<br />
You can use this template for a new category:

```json
{
    "title": "",
    "options": [
        {
            "name": "",
            "creator": "",
            "asset": ""
        }
    ]
}
```

### `.trim.json` files
U probably wont use this but it is cool to know

If u set the asset to a file which ends with `.trim.json`, it can display a minecraft skin wearing armour with trims.

This is an example of a trim
```json
{
    "armor_material": "netherite",
    "skin": "shan.png",
    "helmet": { "trim": "flow", "material": "quartz" },
    "chestplate": { "trim": "eye", "material": "redstone" },
    "leggings": { "trim": "flow", "material": "quartz" },
    "boots": { "trim": "dune", "material": "diamond" }
}
```
 * `armor_material` - Material of the entire armour. If you don't include this, you can make the skin not wear any armour.
 * `skin` - The skin the player is wearing. You can add more skins at [/static/trims/skins/](https://github.com/nisiosh/igg-awards-s26/tree/main/static/trims/skins)
 * `helmet`, `chestplate`, `leggings`, `boots` - The trim on the armour piece. If you don't write an armour piece, the character will still wear the armour but with no trim.

Each actual trim has 2 values: `trim` and `material`
 * `trim`- The name of the trim
 * `material` - The ore that decides the colour of the trim


### Creating a new ballot
If u wanna create a new ballot for whatever reason, its pretty simple. 

Create a new json file in /ballots/, then add it to [/ballots/ballots.json](https://github.com/nisiosh/igg-awards-s26/blob/main/src/lib/ballots/ballots.json), which defines the order of all of the ballots. 

### Congrats
You now know how to create and edit ballots for the summer 2026 igg awards! The site is still work in progress, so things will prob change and more things will be added.