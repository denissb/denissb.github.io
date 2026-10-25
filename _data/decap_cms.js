const field = (label, widget, extra = {}) => ({
  label,
  name: label.toLowerCase(),
  widget,
  required: false,
  ...extra,
});

const pageFields = () => [
  field("Title", "string"),
  field("Url", "string"),
  field("Body", "markdown"),
  field("Menu", "object", {
    fields: [
      field("Visible", "boolean"),
      field("Order", "number"),
    ],
  }),
  field("templateClass", "hidden"),
  field("layout", "hidden"),
];

const config = {
  backend: {
    name: "git-gateway",
    branch: "master",
  },
  media_folder: "img",
  collections: [
    {
      label: "Posts",
      name: "posts",
      folder: "posts",
      description: "Here you can create or edit your posts",
      editor: { preview: false },
      create: true,
      view_filters: [
        { label: "Draft", field: "draft", pattern: true },
      ],
      fields: [
        field("Title", "string"),
        field("Description", "string"),
        field("Date", "datetime"),
        field("Tags", "list"),
        field("Draft", "boolean"),
        field("Body", "markdown"),
      ],
    },
    {
      label: "Pages",
      name: "pages",
      description: "Here you can edit your individual pages",
      editor: { preview: false },
      files: [
        {
          label: "About",
          name: "about",
          file: "about.md",
          fields: pageFields(),
        },
        { label: "404", name: "404", file: "404.md", fields: pageFields() },
      ],
    },
  ],
};

export default config;
