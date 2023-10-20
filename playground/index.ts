import {generateIconToJSON} from "../src";

(async function () {
    await generateIconToJSON('./playground/icons', './playground/icon.json', 'bs')

    console.log('success')
})()
