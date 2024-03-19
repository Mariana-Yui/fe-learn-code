export function emit(instance, event, ...args) {
  console.log('emit:', event);

  const { props } = instance;

  // kebab-case to camel
  const camelize = (str: string) => {
    return str.replace(/-(\w)/g, (_, c: string) => {
      return c ? c.toUpperCase() : '';
    });
  };
  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const toHandlerKey = (str: string) => {
    return str ? 'on' + capitalize(str) : '';
  };

  const handlerName = toHandlerKey(camelize(event));
  const handler = props[handlerName];
  handler && handler(...args);
}
