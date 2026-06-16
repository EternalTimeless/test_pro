const fs = require('fs');
const arr = JSON.parse(fs.readFileSync('assets/Scene/Game_3D-002.scene', 'utf8'));

// Build script UUID -> script name map by reading .meta of scripts is heavy;
// instead just dump everything raw for given node ids.

function dumpNode(id) {
  const n = arr[id];
  console.log('----- NODE id=' + id + ' -----');
  console.log(JSON.stringify(n, null, 2));
}

function compFull(compId) {
  const c = arr[compId];
  return c ? c.__type__ : '?';
}

function printTree(id, depth, maxDepth) {
  const n = arr[id];
  if (!n || depth > maxDepth) return;
  const name = n._name || '(noname)';
  const ind = '  '.repeat(depth);
  let comps = '';
  if (n._components) comps = n._components.map(c => compFull(c.__id__)).join(',');
  const pos = n._lpos ? JSON.stringify(n._lpos) : '';
  console.log(ind + '[' + id + '] ' + name + '  (' + comps + ')  pos=' + pos);
  if (n._children) for (const c of n._children) printTree(c.__id__, depth + 1, maxDepth);
}

console.log('========== CreatePropBrand (94) full subtree, depth 5 ==========');
printTree(94, 0, 5);
console.log('\n========== CreatePropBrand-001 (772) full subtree, depth 5 ==========');
printTree(772, 0, 5);
