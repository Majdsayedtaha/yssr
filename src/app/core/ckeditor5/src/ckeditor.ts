import { InlineEditor } from '@ckeditor/ckeditor5-editor-inline';
import { Alignment } from '@ckeditor/ckeditor5-alignment';
import { Autoformat } from '@ckeditor/ckeditor5-autoformat';
import { Bold, Italic } from '@ckeditor/ckeditor5-basic-styles';
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote';
import { CloudServices } from '@ckeditor/ckeditor5-cloud-services';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { FontBackgroundColor, FontColor, FontFamily, FontSize } from '@ckeditor/ckeditor5-font';
import { Heading } from '@ckeditor/ckeditor5-heading';
// import { Image, ImageCaption, ImageStyle, ImageToolbar, ImageUpload } from '@ckeditor/ckeditor5-image';
import { Indent } from '@ckeditor/ckeditor5-indent';
import { Link } from '@ckeditor/ckeditor5-link';
import { List } from '@ckeditor/ckeditor5-list';
import { MediaEmbed } from '@ckeditor/ckeditor5-media-embed';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { PasteFromOffice } from '@ckeditor/ckeditor5-paste-from-office';
import { RemoveFormat } from '@ckeditor/ckeditor5-remove-format';
// import { Table, TableToolbar } from '@ckeditor/ckeditor5-table';
import { TextTransformation } from '@ckeditor/ckeditor5-typing';
import '@ckeditor/ckeditor5-language-ar/src/translations/ar';
import '@ckeditor/ckeditor5-language-en/src/translations/en';

class Editor extends InlineEditor {
  public static override builtinPlugins = [
    Alignment,
    Autoformat,
    BlockQuote,
    Bold,
    CloudServices,
    Essentials,
    FontBackgroundColor,
    FontColor,
    FontFamily,
    FontSize,
    Heading,
    // Image,
    // ImageCaption,
    // ImageStyle,
    // ImageToolbar,
    // ImageUpload,
    Indent,
    Italic,
    Link,
    List,
    MediaEmbed,
    Paragraph,
    PasteFromOffice,
    RemoveFormat,
    // Table,
    // TableToolbar,
    TextTransformation,
  ];

  public static override defaultConfig = {
    toolbar: {
      items: [
        'heading',
        '|',
        'fontFamily',
        'fontBackgroundColor',
        'fontColor',
        'fontSize',
        '|',
        'bold',
        'italic',
        'link',
        'bulletedList',
        'numberedList',
        'blockQuote',
        '|',
        'outdent',
        'indent',
        'alignment',
        'removeFormat',
      ],
    },
    language: {
      ui: 'ar',
    },
    // image: {
    //   toolbar: [
    //     'imageTextAlternative',
    //     'toggleImageCaption',
    //     'imageStyle:inline',
    //     'imageStyle:block',
    //     'imageStyle:side',
    //   ],
    // },
    // table: {
    //   contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
    // },
  };
}

export default Editor;
