define(
  'ephox.snooker.api.Structs',

  [
    'ephox.scullion.Struct'
  ],

  function (Struct) {
    var dimensions = Struct.immutable('width', 'height');
    var grid = Struct.immutable('rows', 'columns');
    var address = Struct.immutable('row', 'column');
    var coords = Struct.immutable('x', 'y');
    var detail = Struct.immutable('element', 'rowspan', 'colspan');
    var extended = Struct.immutable('element', 'rowspan', 'colspan', 'row', 'column');
    var context = Struct.immutable('before', 'on', 'after');
    var rowdata = Struct.immutable('element', 'cells', 'section');
    var rowcells = Struct.immutable('cells', 'section');
    var rowdetails = Struct.immutable('details', 'section');
    var bounds = Struct.immutableBag([ 'startRow', 'startCol', 'finishRow', 'finishCol'], []);
    var cell = Struct.immutableBag([ 'row', 'col'], [] );

    return {
      dimensions: dimensions,
      grid: grid,
      address: address,
      coords: coords,
      extended: extended,
      detail: detail,
      context: context,
      rowdata: rowdata,
      rowcells: rowcells,
      rowdetails: rowdetails,
      bounds: bounds,
      cell: cell
    };
  }
);