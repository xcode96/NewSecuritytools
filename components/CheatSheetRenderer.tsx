import React from 'react';
import { CodeBlock } from './CodeBlock';
import {
  InfoIcon, LightbulbIcon, ShieldCheckIcon, WarningTriangleIcon, XCircleIcon,
} from './IconComponents';
import mermaid from 'mermaid';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const MermaidDiagram: React.FC<{ chart: string }> = ({ chart }) => {
  const [svg, setSvg] = React.useState('');
  const id = React.useId().replace(/:/g, '');

  React.useEffect(() => {
    try {
      mermaid.initialize({ startOnLoad: false, theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default' });
      mermaid.render(`mermaid-${id}`, chart).then(({ svg }) => {
        setSvg(svg);
      });
    } catch (err) {
      console.error('Mermaid render error:', err);
      // Fallback for error to avoid crashing
    }
  }, [chart, id]);

  return <div className="mermaid my-6 flex justify-center bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm overflow-x-auto" dangerouslySetInnerHTML={{ __html: svg }} />;
};

const KatexMath: React.FC<{ expr: string, isBlock?: boolean }> = ({ expr, isBlock = false }) => {
  const html = React.useMemo(() => {
    try {
      return katex.renderToString(expr, { displayMode: isBlock, throwOnError: false });
    } catch (e) {
      return `<span class="text-red-500 font-mono text-sm bg-red-50 dark:bg-red-900/20 px-1 rounded">Math syntax error</span>`;
    }
  }, [expr, isBlock]);

  return (
    <span
      dangerouslySetInnerHTML={{ __html: html }}
      className={isBlock ? "block my-6 text-center overflow-x-auto p-2" : "inline-block px-1"}
    />
  );
};

interface CheatSheetRendererProps {
  content: string;
}

// Emoji map for common emoji shortcodes
const emojiMap: { [key: string]: string } = {
  'smile': '😊', 'laughing': '😆', 'blush': '😊', 'heart': '❤️', 'thumbsup': '👍', 'thumbsdown': '👎',
  'ok_hand': '👌', 'point_up': '☝️', 'point_down': '👇', 'point_left': '👈', 'point_right': '👉',
  'raised_hand': '✋', 'pray': '🙏', 'clap': '👏', 'muscle': '💪', 'fire': '🔥', 'star': '⭐',
  'sparkles': '✨', 'zap': '⚡', 'boom': '💥', 'rocket': '🚀', 'tada': '🎉', 'confetti_ball': '🎊',
  'warning': '⚠️', 'x': '❌', 'white_check_mark': '✅', 'heavy_check_mark': '✔️', 'question': '❓',
  'exclamation': '❗', 'bulb': '💡', 'bell': '🔔', 'lock': '🔒', 'unlock': '🔓', 'key': '🔑',
  'mag': '🔍', 'link': '🔗', 'pencil': '✏️', 'memo': '📝', 'book': '📖', 'books': '📚',
  'computer': '💻', 'keyboard': '⌨️', 'desktop_computer': '🖥️', 'laptop': '💻', 'phone': '📱',
  'email': '📧', 'inbox_tray': '📥', 'outbox_tray': '📤', 'package': '📦', 'bug': '🐛',
  'construction': '🚧', 'wrench': '🔧', 'hammer': '🔨', 'gear': '⚙️', 'shield': '🛡️',
  'eyes': '👀', 'brain': '🧠', 'thinking': '🤔', 'wave': '👋', 'cool': '😎', 'nerd_face': '🤓'
};

const parseInlineFormatting = (text: string, footnotes?: Map<string, number>): React.ReactNode => {
  // Enhanced regex for all inline formatting - order matters: longer patterns first
  const combinedRegex = /(\$\$[^$]+\$\$|\$[^$]+\$|\*\*.*?\*\*|==.*?==|~~.*?~~|\^.*?\^|~(?!~).*?~(?!~)|`.*?`|\[\[.*?\]\]|:\w+:|\[\^[\w-]+\]|!\[.*?\]\(.*?\)|\[.*?\]\(.*?\)|\*(?!\*).*?\*(?!\*)|https?:\/\/[^\s]+)/g;

  const parts = text.split(combinedRegex).filter(p => p !== undefined);

  return (
    <>
      {parts.map((part, index) => {
        if (!part) return null;

        // Block Math inline: $$...$$
        if (part.startsWith('$$') && part.endsWith('$$') && part.length > 4) {
          return <KatexMath key={index} expr={part.slice(2, -2)} isBlock={true} />;
        }

        // Inline Math: $...$
        if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
          return <KatexMath key={index} expr={part.slice(1, -1)} isBlock={false} />;
        }

        // Bold: **text**
        if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
          return <strong key={index}>{parseInlineFormatting(part.slice(2, -2), footnotes)}</strong>;
        }

        // Highlight: ==text==
        if (part.startsWith('==') && part.endsWith('==') && part.length > 4) {
          return <mark key={index} className="bg-yellow-200 dark:bg-yellow-700/50 px-1 rounded">{parseInlineFormatting(part.slice(2, -2), footnotes)}</mark>;
        }

        // Strikethrough: ~~text~~
        if (part.startsWith('~~') && part.endsWith('~~') && part.length > 4) {
          return <s key={index}>{parseInlineFormatting(part.slice(2, -2), footnotes)}</s>;
        }

        // Superscript: ^text^
        if (part.startsWith('^') && part.endsWith('^') && part.length > 2 && !part.includes(' ')) {
          return <sup key={index} className="text-xs">{part.slice(1, -1)}</sup>;
        }

        // Subscript: ~text~ (but not ~~)
        if (part.startsWith('~') && part.endsWith('~') && part.length > 2 && !part.startsWith('~~')) {
          return <sub key={index} className="text-xs">{part.slice(1, -1)}</sub>;
        }

        // Inline code: `code`
        if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
          return <code key={index} className="bg-slate-200 dark:bg-slate-700 text-rose-600 dark:text-rose-400 font-mono text-sm px-1.5 py-0.5 rounded">{part.slice(1, -1)}</code>;
        }

        // Keyboard key: [[key]]
        if (part.startsWith('[[') && part.endsWith(']]') && part.length > 4) {
          return <kbd key={index} className="px-2 py-1 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded shadow-sm">{part.slice(2, -2)}</kbd>;
        }

        // Emoji: :emoji_name:
        if (part.startsWith(':') && part.endsWith(':') && part.length > 2) {
          const emojiName = part.slice(1, -1);
          const emoji = emojiMap[emojiName];
          if (emoji) {
            return <span key={index} className="text-lg">{emoji}</span>;
          }
        }

        // Footnote reference: [^1]
        if (part.match(/^\[\^[\w-]+\]$/)) {
          const refId = part.slice(2, -1);
          const refNum = footnotes?.get(refId) || '?';
          return (
            <sup key={index}>
              <a href={`#fn-${refId}`} id={`fnref-${refId}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                [{refNum}]
              </a>
            </sup>
          );
        }

        // Image: ![alt](url)
        if (part.startsWith('![') && part.includes('](') && part.endsWith(')')) {
          const imageMatch = part.match(/!\[(.*?)\]\((.*?)\)/);
          if (imageMatch) {
            const altText = imageMatch[1];
            const imageUrl = imageMatch[2];
            return <img src={imageUrl} alt={altText} key={index} className="max-w-full h-auto my-4 rounded-lg shadow-md" />
          }
        }

        // Link: [text](url)
        if (part.startsWith('[') && !part.startsWith('![') && !part.startsWith('[^') && part.includes('](') && part.endsWith(')')) {
          const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
          if (linkMatch) {
            const linkText = linkMatch[1];
            const linkUrl = linkMatch[2];
            return <a href={linkUrl} key={index} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">{parseInlineFormatting(linkText, footnotes)}</a>
          }
        }

        // Italic: *text* (but not **)
        if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**') && part.length > 2) {
          return <em key={index}>{parseInlineFormatting(part.slice(1, -1), footnotes)}</em>;
        }

        // Auto-link URLs
        if (part.match(/^https?:\/\/[^\s]+$/)) {
          return <a href={part} key={index} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline break-all">{part}</a>;
        }

        return part;
      })}
    </>
  );
};


const CheatSheetRenderer: React.FC<CheatSheetRendererProps> = ({ content }) => {
  const elements: React.ReactElement[] = [];
  const lines = content.trim().split('\n');
  let i = 0;

  const isTableLine = (line: string) => line.trim().startsWith('|') && line.trim().endsWith('|');
  const isTableSeparator = (line: string) => /^\|(?:\s*:?-+:?\s*\|)+$/.test(line.trim());
  const parseTableLine = (line: string): string[] => {
    return line.trim().slice(1, -1).split(/(?<!\\)\|/).map(cell => cell.trim().replace(/\\\|/g, '|'));
  };
  const isHorizontalRule = (line: string) => {
    const trimmed = line.trim();
    return /^(?:---|\\*\\*\\*|\* \* \*)$/.test(trimmed) && trimmed.length >= 3;
  };

  const getIndent = (line: string) => line.match(/^\s*/)?.[0].length || 0;

  const isListItem = (line: string) => {
    const trimmed = line.trim();
    return trimmed.startsWith('* ') || trimmed.startsWith('- ') || /^\d+\.\s/.test(trimmed);
  };

  const isSpecialLine = (line: string) => {
    const trimmed = line.trim();
    return trimmed.startsWith('#') ||
      isListItem(trimmed) ||
      trimmed.startsWith('>') ||
      trimmed.startsWith('$$') ||
      trimmed.startsWith('$') ||
      trimmed.startsWith('```') ||
      isTableLine(trimmed) ||
      isHorizontalRule(trimmed);
  };

  const parseList = (startIndex: number): { element: React.ReactNode; newIndex: number } => {
    const parseLevel = (currentIndex: number, indentLevel: number): { element: React.ReactElement; nextIndex: number } => {
      const items: React.ReactElement[] = [];
      let i = currentIndex;

      while (i < lines.length) {
        const line = lines[i];
        const currentIndent = getIndent(line);
        const trimmedLine = line.trim();

        if (!isListItem(trimmedLine) && trimmedLine !== '') break;
        if (trimmedLine === '') {
          i++;
          continue;
        };
        if (currentIndent < indentLevel) break;

        if (currentIndent > indentLevel) {
          const { element: nestedList, nextIndex } = parseLevel(i, currentIndent);
          if (items.length > 0) {
            const lastItem = items[items.length - 1];
            const newChildren = React.Children.toArray((lastItem.props as { children?: React.ReactNode }).children);
            newChildren.push(nestedList);
            items[items.length - 1] = React.cloneElement(lastItem, {}, newChildren);
          }
          i = nextIndex;
          continue;
        }

        const taskMatch = trimmedLine.match(/^(\*|-|\d+\.)\s+\[(x| )\]\s+(.*)/i);
        let contentNode: React.ReactNode;
        let liClassName = '';

        if (taskMatch) {
          const isChecked = taskMatch[2].toLowerCase() === 'x';
          liClassName = 'list-none';
          contentNode = (
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={isChecked} readOnly className="mt-1 flex-shrink-0 appearance-none w-4 h-4 rounded-sm border-2 border-slate-400 dark:border-slate-500 checked:bg-blue-600 checked:border-blue-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 transition" />
              <span className={isChecked ? 'line-through text-slate-500 dark:text-slate-400' : ''}>
                {parseInlineFormatting(taskMatch[3])}
              </span>
            </label>
          );
        } else {
          contentNode = parseInlineFormatting(trimmedLine.replace(/^(\*|-|\d+\.)\s+/, ''));
        }

        items.push(<li key={i} className={liClassName}>{contentNode}</li>);
        i++;
      }

      const firstLine = lines[currentIndex]?.trim();
      const isOrdered = /^\d+\.\s/.test(firstLine);
      const ListTag = isOrdered ? 'ol' : 'ul';
      const listClasses = isOrdered
        ? "list-decimal list-outside space-y-2 pl-6 my-2"
        : "list-disc list-outside space-y-2 pl-6 my-2";

      return {
        element: <ListTag className={listClasses}>{items}</ListTag>,
        nextIndex: i
      };
    };

    const { element, nextIndex } = parseLevel(startIndex, getIndent(lines[startIndex]));
    return { element, newIndex: nextIndex };
  };

  // Helper function to detect if a line contains HTML tags
  const containsHTMLTag = (line: string): boolean => {
    const htmlTagPattern = /<\/?[a-z][\s\S]*>/i;
    return htmlTagPattern.test(line);
  };

  // Helper function to collect HTML block
  const collectHTMLBlock = (startIndex: number): { html: string; endIndex: number } => {
    let htmlContent = '';
    let j = startIndex;
    let openTags = 0;

    // Collect lines that appear to be HTML
    while (j < lines.length) {
      const currentLine = lines[j];

      // Count opening and closing tags
      const openingTags = (currentLine.match(/<[a-z][\s\S]*?>/gi) || []).filter(tag => !tag.startsWith('</')).length;
      const closingTags = (currentLine.match(/<\/[a-z][\s\S]*?>/gi) || []).length;

      openTags += openingTags - closingTags;
      htmlContent += currentLine + '\n';

      // If we've closed all tags and have content, we're done
      if (openTags <= 0 && htmlContent.trim()) {
        j++;
        break;
      }

      j++;

      // Safety check: if next line doesn't look like HTML and we have content, stop
      if (j < lines.length && !containsHTMLTag(lines[j]) && !lines[j].trim().startsWith('<') && htmlContent.trim()) {
        break;
      }
    }

    return { html: htmlContent.trim(), endIndex: j };
  };

  while (i < lines.length) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Check for HTML content first
    if (containsHTMLTag(trimmedLine) && !trimmedLine.startsWith('```')) {
      const { html, endIndex } = collectHTMLBlock(i);
      elements.push(
        <div
          key={`html-${i}`}
          dangerouslySetInnerHTML={{ __html: html }}
          className="my-4"
        />
      );
      i = endIndex;
      continue;
    }

    if (trimmedLine.startsWith('#')) {
      const level = trimmedLine.match(/^#+/)?.[0].length || 1;
      const text = trimmedLine.replace(/^#+\s*/, '');
      const Tag = `h${Math.min(level + 1, 6)}` as keyof React.JSX.IntrinsicElements;
      const classMap: { [key: string]: string } = {
        'h2': 'text-3xl font-black mb-4 mt-8 first:mt-0 border-b border-slate-300 dark:border-slate-700 pb-2',
        'h3': 'text-2xl font-bold mb-3 mt-6 first:mt-0',
        'h4': 'text-xl font-semibold mb-2 mt-5 first:mt-0',
        'h5': 'text-lg font-semibold mb-2 mt-4 first:mt-0',
        'h6': 'text-base font-semibold mb-2 mt-4 first:mt-0'
      };
      const className = classMap[Tag as string] || 'text-lg font-semibold mb-2 mt-4 first:mt-0';

      elements.push(React.createElement(Tag, { key: i, className }, parseInlineFormatting(text)));
      i++;
    } else if (isHorizontalRule(trimmedLine)) {
      elements.push(<hr key={i} className="my-8 border-slate-300 dark:border-slate-700" />);
      i++;
    } else if (isTableLine(trimmedLine) && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      const headerCells = parseTableLine(lines[i]);
      const tableRows: string[][] = [];
      i += 2; // Move past header and separator

      while (i < lines.length && isTableLine(lines[i])) {
        tableRows.push(parseTableLine(lines[i]));
        i++;
      }

      elements.push(
        <div key={`table-wrapper-${i}`} className="overflow-x-auto my-6">
          <table key={`table-${i}`} className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/60">
                {headerCells.map((header, index) => (
                  <th key={index} className="border border-slate-300 dark:border-slate-600 p-3 font-semibold text-left">
                    {parseInlineFormatting(header)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, rowIndex) => (
                <tr key={rowIndex} className="even:bg-slate-50/50 dark:even:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="border border-slate-300 dark:border-slate-600 p-3 align-top">
                      {parseInlineFormatting(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (trimmedLine.startsWith('>')) {
      const blockquoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        blockquoteLines.push(lines[i].trim().replace(/^>\s*/, ''));
        i++;
      }

      let content = blockquoteLines.join('\n');
      const calloutMatch = content.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/);

      if (calloutMatch) {
        const calloutType = calloutMatch[1];
        content = content.substring(calloutMatch[0].length);

        const calloutStyles = {
          NOTE: { icon: <InfoIcon className="w-5 h-5 text-blue-500" />, container: "bg-blue-50 dark:bg-slate-800/50 border-blue-500 text-blue-800 dark:text-blue-300", title: "text-blue-900 dark:text-blue-200" },
          TIP: { icon: <LightbulbIcon className="w-5 h-5 text-green-500" />, container: "bg-green-50 dark:bg-slate-800/50 border-green-500 text-green-800 dark:text-green-300", title: "text-green-900 dark:text-green-200" },
          IMPORTANT: { icon: <ShieldCheckIcon className="w-5 h-5 text-purple-500" />, container: "bg-purple-50 dark:bg-slate-800/50 border-purple-500 text-purple-800 dark:text-purple-300", title: "text-purple-900 dark:text-purple-200" },
          WARNING: { icon: <WarningTriangleIcon className="w-5 h-5 text-yellow-500" />, container: "bg-yellow-50 dark:bg-slate-800/50 border-yellow-500 text-yellow-800 dark:text-yellow-300", title: "text-yellow-900 dark:text-yellow-200" },
          CAUTION: { icon: <XCircleIcon className="w-5 h-5 text-red-500" />, container: "bg-red-50 dark:bg-slate-800/50 border-red-500 text-red-800 dark:text-red-300", title: "text-red-900 dark:text-red-200" },
        };
        const styles = calloutStyles[calloutType as keyof typeof calloutStyles];

        elements.push(
          <div key={i} className={`my-4 p-4 border-l-4 rounded-r-lg flex gap-3 ${styles.container}`}>
            <div className="flex-shrink-0 pt-0.5">{styles.icon}</div>
            <div className="flex-grow">
              <p className={`font-bold ${styles.title}`}>{calloutType}</p>
              <div className="prose-p:my-1 prose-p:leading-normal">
                {content.split('\n').map((p, pIndex) => (p.trim() ? <p key={pIndex}>{parseInlineFormatting(p)}</p> : null))}
              </div>
            </div>
          </div>
        );
      } else {
        elements.push(
          <blockquote key={i} className="border-l-4 border-slate-300 dark:border-slate-600 pl-4 text-slate-600 dark:text-slate-400 my-4">
            {content.split('\n').map((p, pIndex) => (
              p ? <p key={pIndex}>{parseInlineFormatting(p)}</p> : null
            ))}
          </blockquote>
        );
      }
    } else if (trimmedLine.startsWith('$$')) {
      let mathContent = '';
      if (trimmedLine.length > 2) mathContent += trimmedLine.replace(/^\$\$/, '') + '\n';

      i++; // Move past opening $$ (or process it if it has content)
      // Check if it was single line $$...$$
      if (trimmedLine.endsWith('$$') && trimmedLine.length > 2) {
        mathContent = trimmedLine.slice(2, -2);
      } else {
        while (i < lines.length && !lines[i].trim().endsWith('$$')) {
          mathContent += lines[i] + '\n';
          i++;
        }
        // Handle closing line
        if (i < lines.length) {
          mathContent += lines[i].trim().replace(/\$\$$/, '');
          i++;
        }
      }
      elements.push(<KatexMath key={i} expr={mathContent.trim()} isBlock={true} />);
    } else if (trimmedLine.startsWith('$')) {
      elements.push(<CodeBlock key={i} code={trimmedLine.replace(/^\$\s*/, '')} language="bash" />);
      i++;
    } else if (trimmedLine.startsWith('```')) {
      const language = trimmedLine.substring(3).trim().toLowerCase() || 'bash';
      let codeContent = '';
      i++; // Move past the opening ```
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeContent += lines[i] + '\n';
        i++;
      }

      if (language === 'mermaid') {
        elements.push(<MermaidDiagram key={i} chart={codeContent.trimEnd()} />);
      } else {
        elements.push(<CodeBlock key={i} code={codeContent.trimEnd()} language={language} />);
      }
      i++; // Move past the closing ```
    } else if (isListItem(trimmedLine)) {
      const { element, newIndex } = parseList(i);
      elements.push(React.cloneElement(element as React.ReactElement, { key: `list-${i}` }));
      i = newIndex;
    } else if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
      const listItems: React.ReactNode[] = [];
      while (i < lines.length && (lines[i].trim().startsWith('* ') || lines[i].trim().startsWith('- '))) {
        listItems.push(parseInlineFormatting(lines[i].trim().replace(/^(\*|-)\s*/, '')));
        i++;
      }
      elements.push(
        <ul key={i} className="list-disc list-outside space-y-2 pl-6 my-4">
          {listItems.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
      );
    } else if (trimmedLine.match(/^\d+\.\s/)) {
      const listItems: React.ReactNode[] = [];
      while (i < lines.length && lines[i].trim().match(/^\d+\.\s*/)) {
        listItems.push(parseInlineFormatting(lines[i].trim().replace(/^\d+\.\s*/, '')));
        i++;
      }
      elements.push(
        <ol key={i} className="list-decimal list-outside space-y-2 pl-6 my-4">
          {listItems.map((item, index) => <li key={index}>{item}</li>)}
        </ol>
      );
    } else if (trimmedLine === '') {
      i++;
    } else {
      let paragraphLines: string[] = [];
      while (i < lines.length && lines[i].trim() !== '' && !isSpecialLine(lines[i])) {
        paragraphLines.push(lines[i]);
        i++;
      }
      elements.push(<p key={i} className="my-4">{parseInlineFormatting(paragraphLines.join(' '))}</p>);
    }
  }

  return (
    <div className="prose prose-slate dark:prose-invert max-w-none prose-p:leading-relaxed prose-td:break-words">
      {elements}
    </div>
  );
};

export default CheatSheetRenderer;