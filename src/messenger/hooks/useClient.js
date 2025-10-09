export default function useClient() {
  const notification = (func, msg) => {
    func(msg, { theme: 'colored' });
  };

  return { notification };
}
