export default function() {
  let i;
  return [...Array(26)].map((_) => (++i).toString(36), (i = 9));
}
