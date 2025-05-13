import { Editor } from '@tinymce/tinymce-react';
import { forwardRef, memo, useEffect, useImperativeHandle, useRef, useState } from 'react';
import "./tinyEditor.scss"

const TinyMce = forwardRef(function TinyMce({ value, height = 200, onChange }, ref) {

  const [editorContent, setEditorContent] = useState('');
  const editorRef = useRef(null);

  useEffect(() => {
    if (value) {
      setEditorContent(value)
    }
  }, [value]);
 
  // useImperativeHandle(ref, () => ({
  //   getContent: () => {
  //     return editorContent;
  //   },
  // }), [editorContent]);

  return (
    <Editor
      onInit={(evt, editor) => editorRef.current = editor}
      apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
      value={editorContent}
      init={{
        inline: true,
        menubar: false,
        toolbar: false,
        contextmenu: false,
        context_toolbar: true,
        plugins: ['lists', 'link'],
        setup: (editor) => {
          editor.ui.registry.addContextToolbar('textselection', {
            predicate: (node) => !editor.selection.isCollapsed(), // chỉ hiện khi có bôi đen
            items: 'fontsize bold italic underline link bullist numlist alignleft aligncenter alignright alignjustify',
            position: 'selection',
            scope: 'node',
          });
        },
      }}
      tagName="div"
      className="editor-wrapper"
      onEditorChange={(content) => {
        setEditorContent(content);
        onChange?.(content); // Gửi dữ liệu lên cha
      }}
    />
  );
});

TinyMce.displayName = 'TinyMce';

const MemoizedTinyMce= memo(TinyMce);
export default MemoizedTinyMce;