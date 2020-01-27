const LogHelper = require('./LogHelper');

const logDecorator = (Class) => {
  const instance = new Class;
  const methods = Reflect.ownKeys(Object.getPrototypeOf(instance)).filter((m) => m !== 'constructor');
  methods.forEach((method) => {
    const original = instance[method];
    instance[method] = (...args) => {
      LogHelper.debug(`${instance.name}.${original.name}`, args, instnace.name);
      return original.call(instance, args);
    };
  });
  return instance;
}

module.exports = logDecorator;
