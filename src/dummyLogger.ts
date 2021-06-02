/** @internal */
export default (name: string) => ({
  error: (message: string, stack: any) => {
    console.log(`[${name}]: ${message}`, stack);
  },
});
