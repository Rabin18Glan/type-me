// Standard QWERTY keyboard layout
const qwertyLayout = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
  ["Tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
  ["CapsLock", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "Enter"],
  ["Shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "Shift"],
  ["Ctrl", "Alt", "Space", "Alt", "Ctrl"],
]

// AZERTY keyboard layout (French)
const azertyLayout = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
  ["Tab", "a", "z", "e", "r", "t", "y", "u", "i", "o", "p", "^", "$", "Enter"],
  ["CapsLock", "q", "s", "d", "f", "g", "h", "j", '  "y', "u", "i", "o", "p", "^", "$", "Enter"],
  ["CapsLock", "q", "s", "d", "f", "g", "h", "j", "k", "l", "m", "ù", "*"],
  ["Shift", "w", "x", "c", "v", "b", "n", ",", ";", ":", "!", "Shift"],
  ["Ctrl", "Alt", "Space", "Alt", "Ctrl"],
]

// QWERTZ keyboard layout (German)
const qwertzLayout = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "ß", "´", "Backspace"],
  ["Tab", "q", "w", "e", "r", "t", "z", "u", "i", "o", "p", "ü", "+", "Enter"],
  ["CapsLock", "a", "s", "d", "f", "g", "h", "j", "k", "l", "ö", "ä", "#"],
  ["Shift", "<", "y", "x", "c", "v", "b", "n", "m", ",", ".", "-", "Shift"],
  ["Ctrl", "Alt", "Space", "Alt", "Ctrl"],
]

// Cyrillic keyboard layout (Russian)
const cyrillicLayout = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
  ["Tab", "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ", "\\"],
  ["CapsLock", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "Enter"],
  ["Shift", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".", "Shift"],
  ["Ctrl", "Alt", "Space", "Alt", "Ctrl"],
]

// Nepali Traditional keyboard layout
const nepaliLayout = [
  ["१", "२", "३", "४", "५", "६", "७", "८", "९", "०", "-", "=", "Backspace"],
  ["Tab", "ट", "ध", "भ", "च", "त", "थ", "ग", "ष", "य", "उ", "ृ", "े", "\\"],
  ["CapsLock", "ो", "े", "्", "ि", "ु", "प", "र", "क", "त", "च", "ट", "Enter"],
  ["Shift", "ं", "म", "न", "व", "ल", "स", "य", "ब", ".", "/", "Shift"],
  ["Ctrl", "Alt", "Space", "Alt", "Ctrl"],
]

export function getKeyboardLayout(languageCode: string): string[][] {
  switch (languageCode) {
    case "fr":
      return azertyLayout
    case "de":
    case "at":
    case "ch":
      return qwertzLayout
    case "ru":
    case "uk":
    case "bg":
      return cyrillicLayout
    case "ne":
      return nepaliLayout
    default:
      return qwertyLayout
  }
}
