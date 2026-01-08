export function slugify(s: string) {
  const a = s.toLowerCase().trim();
  console.log(a);
  return a;
}

export function extractHeadings(content: string) {

  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  
  const headings = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length; 
    const text = match[2].trim();
    
    const id = text
      .toLowerCase()
      .replace(/\s+/g, "-")            // 공백을 -로
      .replace(/[^\w\uAC00-\uD7A3-]+/g, ""); 

    headings.push({ text, id, level });
  }

  return headings;
}

