const TableArray = [
    {
        tableName: 'users',
        columns: [
            {columnName: 'id', dataType: 'BIGINT(100)', primaryKey: true, notNull: true},
            {columnName: 'firstName', dataType: 'varchar(255)'},
            {columnName: 'otherName', dataType: 'varchar(255)'},
            {columnName: 'lastName', dataType: 'varchar(255)'},
            {columnName: 'password', dataType: 'text'},
            {columnName: 'email', dataType: 'varchar(50)'},
            {columnName: 'status', dataType: 'varchar(50)'},
            {columnName: 'sessionID', dataType: 'BIGINT(100)'},
            {columnName: 'createdAt', dataType: 'datetime'}
        ],
        alterColumns: [
            {columnName: 'role', dataType: 'varchar(50)', addOrDrop: 'add', afterColumnName: 'password'},
        ],
        foreignKeys: []
    }
]