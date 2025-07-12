const sanitizeHtml = require('sanitize-html');

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return sanitizeHtml(input, {
    allowedTags: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
      'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
      'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'img'
    ],
    allowedAttributes: {
      'a': ['href', 'name', 'target'],
      'img': ['src', 'alt'],
      '*': ['class']
    },
    allowedSchemes: ['http', 'https', 'ftp', 'mailto'],
  });
};

module.exports = sanitizeInput;
