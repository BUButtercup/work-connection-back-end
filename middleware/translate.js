/**
 * TODO(developer): Uncomment the following line before running the sample.
 */
require('dotenv').config();
const projectId = 'smart-visitor-345420';

// Imports the Google Cloud client library
const {Translate} = require('@google-cloud/translate').v2;
const key = process.env.GOOGLE_APPLICATION_CREDENTIALS
// Instantiates a client
const translate = new Translate({projectId, key});

async function quickStart() {
  // The text to translate
  const text = 'Hello, world!';

  // The target language
  const target = 'ru';

  // Translates some text into Russian
  const [translation] = await translate.translate(text, target);
  console.log(`Text: ${text}`);
  console.log(`Translation: ${translation}`);
}

quickStart();