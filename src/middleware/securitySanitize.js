const { escape } = require('validator');
const xss = require('xss');

/**
 * Middleware de sanitização e proteção XSS
 * @param {Object} options - Configurações opcionais
 * @param {boolean} options.escapeHtml - Ativa escape HTML (default: true)
 * @param {boolean} options.xssFilter - Ativa filtro XSS (default: true)
 * @param {string[]} options.skipFields - Campos para não sanitizar
 */
function securityMiddleware (options = {}) {
  const defaultOptions = {
    escapeHtml: true,
    xssFilter: true,
    skipFields: ['password', 'token', 'hash'] // Campos sensíveis que não devem ser alterados
  };

  const config = { ...defaultOptions, ...options };

  return (req, res, next) => {
    try {
      // Sanitiza o body
      if (req.body) {
        req.body = deepSanitize(req.body, config);
      }

      // Sanitiza os query params
      if (req.query) {
        req.query = deepSanitize(req.query, config);
      }

      // Sanitiza os route params
      if (req.params) {
        req.params = deepSanitize(req.params, config);
      }

      // Sanitiza headers específicos
      const headersToSanitize = ['referer', 'user-agent', 'cookie'];
      headersToSanitize.forEach(header => {
        if (req.headers[header]) {
          req.headers[header] = deepSanitize(req.headers[header], config);
        }
      });

      next();
    } catch (error) {
      console.error('Security middleware error:', error);
      res.status(500).json({ 
        error: 'Erro de processamento de segurança',
        details: 'Falha ao sanitizar dados de entrada'
      });
    }
  };
};

// Função auxiliar para sanitização profunda
function deepSanitize(data, config) {
  if (data === null || data === undefined) {
    return data;
  }

  // Sanitiza arrays
  if (Array.isArray(data)) {
    return data.map(item => deepSanitize(item, config));
  }

  // Sanitiza objetos
  if (typeof data === 'object') {
    const sanitized = {};
    for (const key in data) {
      if (config.skipFields.includes(key)) {
        sanitized[key] = data[key]; // Preserva campos sensíveis
      } else {
        sanitized[key] = deepSanitize(data[key], config);
      }
    }
    return sanitized;
  }

  // Sanitiza strings
  if (typeof data === 'string') {
    let sanitized = data;
    
    if (config.escapeHtml) {
      sanitized = escape(sanitized);
    }

    if (config.xssFilter) {
      sanitized = xss(sanitized, {
        whiteList: {}, // Nenhuma tag é permitida
        stripIgnoreTag: true, // Remove tags não permitidas
        stripIgnoreTagBody: ['script'] // Remove conteúdo de tags script
      });
    }

    return sanitized;
  }

  return data;
}

module.exports = { securityMiddleware };