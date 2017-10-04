define(
  'tinymce.plugins.tablenew.actions.Clipboard',

  [
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Option',
    'ephox.snooker.api.CopySelected',
    'ephox.snooker.api.TableFill',
    'ephox.snooker.api.TableLookup',
    'ephox.sugar.api.dom.Replication',
    'ephox.sugar.api.node.Element',
    'ephox.sugar.api.node.Elements',
    'ephox.sugar.api.node.Node',
    'ephox.sugar.api.properties.Html',
    'tinymce.plugins.tablenew.queries.TableTargets',
    'tinymce.plugins.tablenew.selection.Ephemera',
    'tinymce.plugins.tablenew.selection.SelectionTypes'
  ],

  function (Arr, Fun, Option, CopySelected, TableFill, TableLookup, Replication, Element, Elements, Node, Html, TableTargets, Ephemera, SelectionTypes) {
    var extractSelected = function (cells) {
      // Assume for now that we only have one table (also handles the case where we multi select outside a table)
      return TableLookup.table(cells[0]).map(Replication.deep).map(function (replica) {
        return [ CopySelected.extract(replica, Ephemera.attributeSelector()) ];
      });
    };

    var registerEvents = function (editor, selections, actions, cellSelection) {
      editor.on('BeforeGetContent', function (e) {
        var multiCellContext = function (cells) {
          e.preventDefault();
          extractSelected(cells).each(function (elements) {
            e.content = Arr.map(elements, Html.getOuter).join('');
          });
        };

        if (e.selection === true) {
          SelectionTypes.cata(selections.get(), Fun.noop, multiCellContext, Fun.noop);
        }
      });

      editor.on('BeforeSetContent', function (e) {
        if (e.selection === true && e.paste === true) {
          var cellOpt = Option.from(editor.dom.getParent(editor.selection.getStart(), 'th,td'));
          cellOpt.each(function (domCell) {
            var cell = Element.fromDom(domCell);
            var table = TableLookup.table(cell);
            table.bind(function (table) {

              var elements = Arr.filter(Elements.fromHtml(e.content), function (content) {
                return Node.name(content) !== 'meta';
              });

              if (elements.length === 1 && Node.name(elements[0]) === 'table') {
                e.preventDefault();

                var doc = Element.fromDom(editor.getDoc());
                var generators = TableFill.paste(doc);
                var targets = TableTargets.paste(cell, elements[0], generators);
                actions.pasteCells(table, targets).each(function (rng) {
                  editor.selection.setRng(rng);
                  editor.focus();
                  cellSelection.clear(table);
                });
              }
            });
          });
        }
      });
    };

    return {
      registerEvents: registerEvents
    };
  }
);
