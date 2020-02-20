import React, { useRef } from "react";
import MdEditor from "react-markdown-editor-lite";
import MarkdownIt from "markdown-it";
import "react-markdown-editor-lite/lib/index.css";
import { Grid } from "@material-ui/core";
export const CONTENT = "content";

const mdParser = new MarkdownIt();

interface Props {
  onValueChange: Function;
  content: string;
}

function MessageEditor(props: Props) {
  const { content, onValueChange } = props;
  const editorRef = useRef(null);

  const renderHTML = (text: string) => {
    return mdParser.render(text);
  };

  const handleEditorChange = ({ html, text }: any) => {
    onValueChange(CONTENT, text);
  };

  return (
    <Grid container spacing={3} xs={6}>
      <MdEditor
        name="content-editor"
        ref={editorRef}
        value={content}
        renderHTML={renderHTML}
        onChange={handleEditorChange}
        config={{
          view: {
            menu: true,
            md: true,
            html: false,
            fullScreen: false
          }
        }}
        style={{ height: `200px` }}
      />
    </Grid>
  );
}
export default MessageEditor;
