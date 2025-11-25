const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/components/Header.jsx',
  'src/components/Footer.jsx',
  'src/pages/Login.jsx',
  'src/pages/Register.jsx',
  'src/pages/NotFound.jsx',
  'src/pages/Ouvrages.jsx',
  'src/pages/OuvrageDetail.jsx',
  'src/pages/Panier.jsx'
];

filesToFix.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remplacer <style jsx>{` par const styles = `
    if (content.includes('<style jsx>{`')) {
      // Extraire le contenu CSS
      const styleMatch = content.match(/<style jsx>\{`([\s\S]*?)`\}<\/style>/);
      if (styleMatch) {
        const cssContent = styleMatch[1];
        const componentName = path.basename(file, '.jsx');
        const stylesVar = `${componentName.toLowerCase()}Styles`;
        
        // Trouver où insérer la variable (avant le return)
        const returnIndex = content.indexOf('return (');
        if (returnIndex > 0) {
          // Trouver le début de la fonction/composant
          const functionStart = content.lastIndexOf('const ', returnIndex);
          const functionEnd = content.indexOf('=', functionStart);
          const beforeReturn = content.substring(0, returnIndex);
          const afterReturn = content.substring(returnIndex);
          
          // Insérer la variable de styles avant le return
          const stylesDeclaration = `\n  const ${stylesVar} = \`${cssContent}\`;\n\n`;
          content = beforeReturn + stylesDeclaration + afterReturn;
          
          // Remplacer <style jsx>{`...`}</style> par <style>{stylesVar}</style>
          content = content.replace(
            /<style jsx>\{`[\s\S]*?`\}<\/style>/,
            `<style>{${stylesVar}}</style>`
          );
          
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`✅ Corrigé: ${file}`);
        }
      }
    }
  }
});

console.log('\n✅ Tous les fichiers ont été corrigés !');

