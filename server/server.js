require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const _ = require('lodash');

const { poolPromise } = require('./db/db-pool');

var app = express();
var PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());

app.get('/fact-tables', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .query(
        `SELECT * FROM tablica WHERE sifTipTablica = 1`
        );
    res.status(200).send(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/measures/:tableId', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .query(
        `SELECT tablica.sifTablica, tabAtribut.rbrAtrib, tabAtribut.imeSQLAtrib,
        tabAtribut.sifTipAtrib, tabAtribut.imeAtrib, agrFun.sifAgrFun, agrFun.nazAgrFun,
        tablica.nazTablica, tablica.nazSQLTablica, tablica.sifTipTablica,
        tabAtributAgrFun.imeAtrib AS agrImeAtrib
        FROM tabAtribut, agrFun, tablica, tabAtributAgrFun                                          
       WHERE tabAtribut.sifTablica = ${req.params.tableId}
         AND tabAtribut.sifTablica = tablica.sifTablica 
         AND tabAtribut.sifTablica  = tabAtributAgrFun.sifTablica 
         AND tabAtribut.rbrAtrib  = tabAtributAgrFun.rbrAtrib 
         AND tabAtributAgrFun.sifAgrFun = agrFun.sifAgrFun
         AND tabAtribut.sifTablica = tablica.sifTablica 
         AND tabAtribut.sifTipAtrib = 1
       ORDER BY tabAtribut.rbrAtrib`
        );
    res.status(200).send(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/dimensions/:tableId', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .query(
        `SELECT dimTablica.nazTablica
        , dimTablica.nazSQLTablica AS nazSqlDimTablica
        , cinjTablica.nazSQLTablica AS nazSqlCinjTablica
        , cinjTabAtribut.imeSqlAtrib AS cinjTabKljuc
        , dimTabAtribut.imeSqlAtrib AS dimTabKljuc
        , tabAtribut.*
        FROM tabAtribut, dimCinj
        , tablica dimTablica, tablica cinjTablica
        , tabAtribut cinjTabAtribut, tabAtribut dimTabAtribut
        WHERE dimCinj.sifDimTablica = dimTablica.sifTablica
        AND dimCinj.sifCinjTablica = cinjTablica.sifTablica
        AND dimCinj.sifCinjTablica = cinjTabAtribut.sifTablica
        AND dimCinj.rbrCinj = cinjTabAtribut.rbrAtrib
        AND dimCinj.sifDimTablica = dimTabAtribut.sifTablica
        AND dimCinj.rbrDim = dimTabAtribut.rbrAtrib
        AND tabAtribut.sifTablica = dimCinj.sifDimTablica
        AND sifCinjTablica = ${req.params.tableId}
        AND tabAtribut.sifTipAtrib = 2
        ORDER BY dimTablica.nazTablica, rbrAtrib`
        );
    res.status(200).send(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/submit', async (req, res) => {
  let queryString = 'SELECT ';
  
  console.log(req.body)
  
  const dimensionStrings = _.map(req.body.dimensions, dimension => {
    return dimension.nazSqlDimTablica.trim() + "." + dimension.imeSQLAtrib.trim()
            + " AS '" + dimension.imeAtrib.trim() + "'";
  });

  const measureStrings = _.map(req.body.measures, measure => {
    return measure.nazAgrFun.trim() + "(" + measure.nazSQLTablica.trim() + "."
            + measure.imeSQLAtrib.trim() + ") AS '" + measure.agrImeAtrib.trim() + "'"
  });

  if(req.body.dimensions.length > 0) {
    queryString = queryString + dimensionStrings.join(',\n\t')
                  + ',\n\t' + measureStrings.join(',\n\t');
  } else {
    queryString = queryString + measureStrings.join(',\n\t');
  }
  
  const distinctDimTableNames = [...new Set(req.body.dimensions.map(dimension => dimension.nazSqlDimTablica.trim()))];
  
  if(req.body.dimensions.length > 0) {
    queryString = queryString + '\nFROM ' + distinctDimTableNames.join(',\n\t')
                  + ',\n\t' + req.body.factTable.nazSQLTablica;
  } else {
    queryString = queryString + '\nFROM ' + req.body.factTable.nazSQLTablica;
  }

  const distinctWhereClauses = [
    ...new Set(req.body.dimensions.map(dimension => {
      return dimension.nazSqlCinjTablica.trim() + '.' + dimension.cinjTabKljuc.trim() + ' = '
             + dimension.nazSqlDimTablica.trim() + '.' + dimension.dimTabKljuc.trim();
    })
  )];

  if(req.body.dimensions.length > 0) {
    queryString = queryString + '\nWHERE ' + distinctWhereClauses.join('\n\tAND ');

    const groupByClauses = req.body.dimensions.map(
      dimension => dimension.nazSqlDimTablica.trim() + "." + dimension.imeSQLAtrib.trim()
      );
    
    queryString = queryString + '\nGROUP BY ' + groupByClauses.join(',\n\t');
  }
  
  try {
    const pool = await poolPromise;
    const result = await pool.query(queryString);
    res.status(200).send(
      {
        queryString,
        result: result.recordset
      }
    );
  } catch (err) {
    res.status(500).send(err.message);
  }

});

app.listen(PORT, () => {
  console.log(`Started on port ${PORT}`);
});

module.exports = {app};
