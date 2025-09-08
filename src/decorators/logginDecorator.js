export function withLogging(service) {
  return new Proxy(service, {
    get(target, prop) {
      if (typeof target[prop] === 'function') {
        return async function(...args) {          
          try {
            const result = await target[prop].apply(target, args);
            return result;
          } catch (error) {
            console.error(`${prop} fallo en:`, error.message);
            throw error;
          }
        };
      }
      return target[prop];
    }
  });
}