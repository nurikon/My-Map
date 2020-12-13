import SQLite from 'react-native-sqlite-storage';

let dbInstance = ''

const DB = () => {
    return new Promise((resolve, reject) => {
        SQLite.enablePromise(true);
        SQLite.openDatabase({
            name: 'test.db',
            location: 'default'
        })
            .then((db) => {
                resolve()
                dbInstance = db
            })
            .catch(e => {
                reject()
                genericError(e)
            });
    })
}

const createTableLocations = async () => {
    await DB()
    return new Promise((resolve, reject) => {
        dbInstance.executeSql(
            "CREATE TABLE IF NOT EXISTS mylocations (" +
            "id INTEGER PRIMARY KEY NOT NULL ," +
            "locationName TEXT ," +
            "latitude INTEGER ," +
            "longitude INTEGER ," +
            "categoryId INTEGER," +
            "categoryName TEXT," +
            "comment TEXT );"
        ).then((val) => {
            resolve(val)
        }).catch((err) => {
            reject(err)
        })
    });
}

const createTableCategories = async () => {
    await DB()
    return new Promise((resolve, reject) => {
        dbInstance.executeSql(
            "CREATE TABLE IF NOT EXISTS categories (" +
            "id INTEGER PRIMARY KEY NOT NULL ," +
            "visible TEXT ," +
            "categoryName TEXT );"
        ).then((val) => {
            resolve(val)
        }).catch((err) => {
            reject(err)
        })
    });
}

const addLocation = async (props) => {
    await DB()
    const { locationName, latitude, longitude, categoryId, categoryName, comment } = props
    return new Promise((resolve, reject) => {
        dbInstance.executeSql(
            "INSERT INTO mylocations(locationName, latitude, longitude, categoryId, categoryName, comment)" +
            `VALUES("${locationName}", "${latitude}", "${longitude}", "${categoryId}", "${categoryName}", "${comment}")`
        ).then(() => {
            resolve(true);
        }).catch((err) => {
            console.log('EROR addTableTimes', err)
            reject(false);
        })
    });
}

const addCategory = async (categoryName) => {
    await DB()
    const visible = 'true'
    return new Promise((resolve, reject) => {
        dbInstance.executeSql(
            "INSERT INTO categories(categoryName, visible)" +
            `VALUES("${categoryName}", "${visible}")`
        ).then(() => {
            resolve(true);
        }).catch((err) => {
            console.log('EROR addTableTimes', err)
            reject(false);
        })
    });
}

const getAllLocations = async () => {
    await DB()
    return new Promise((resolve, reject) => {
        dbInstance.executeSql(`SELECT * FROM mylocations;`)
            .then(([values]) => {
                var array = [];
                for (let index = 0; index < values.rows.length; index++) {
                    const element = values.rows.item(index);
                    array.push(element);
                }
                resolve(array);
            }).catch((err) => {
                reject(err);
            })
    });
}

const getCategories = async () => {
    await DB()
    return new Promise((resolve, reject) => {
        dbInstance.executeSql(`SELECT * FROM categories;`)
            .then(([values]) => {
                var array = [];
                for (let index = 0; index < values.rows.length; index++) {
                    const element = values.rows.item(index);
                    array.push(element);
                }
                resolve(array);
            }).catch((err) => {
                reject(err);
            })
    });
}

const updateLocation = async (props) => {
    await DB()
    return new Promise((resolve) => {
        dbInstance.executeSql(
            `UPDATE mylocations SET ` +
            `locationName = "${props.locationName}",` +
            `comment ="${props.comment}",` +
            `categoryId ="${props.categoryId}",` +
            `categoryName ="${props.categoryName}"` +
            ` WHERE ID = "${props.id}" `
        )
            .then(() => {
                resolve()
            })
            .catch((err) => {
                console.log('Error', err)
            })
    })
}

const updateCategory = async (item) => {
    await DB()
    return new Promise((resolve) => {
        dbInstance.executeSql(
            `UPDATE categories SET ` +
            `categoryName = "${item.categoryName}",` +
            `visible ="${item.visible}"` +
            ` WHERE id = "${item.id}" `
        )
            .then(() => {
                dbInstance.executeSql(
                    `UPDATE mylocations SET ` +
                    `categoryName = "${item.categoryName}"` +
                    ` WHERE categoryId = "${item.id}" `
                )
            })
            .then(() => resolve())
    })
}

const updateCategoryVisible = async (item) => {
    await DB()
    return new Promise((resolve) => {
        dbInstance.executeSql(
            `UPDATE categories SET ` +
            `categoryName = "${item.categoryName}",` +
            `visible ="${item.visible}"` +
            ` WHERE id = "${item.id}" `
        )
            .then(() => {
                resolve()
            })
            .catch((err) => {
                console.log('Error', err)
            })
    })
}

const deleteCategory = async (item) => {
    await DB()
    return new Promise((resolve) => {
        dbInstance.executeSql(
            "DELETE FROM categories WHERE id =" + item.id
        )
            .then(() => {
                dbInstance.executeSql(
                    "DELETE FROM mylocations WHERE categoryId =" + item.id
                )
            })
            .then(() => resolve())
            .catch((err) => {
                console.log('Error', err)
            })
    })
}

const deleteLocation = async (id) => {
    await DB()
    return new Promise((resolve) => {
        dbInstance.executeSql(
            "DELETE FROM mylocations WHERE id =" + id
        )
            .then(() => {
                resolve()
            })
            .catch((err) => {
                console.log('Error', err)
            })
    })
}

const DbManager = {
    createTableLocations,
    createTableCategories,
    addLocation,
    addCategory,
    getAllLocations,
    getCategories,
    updateLocation,
    updateCategory,
    updateCategoryVisible,
    deleteLocation,
    deleteCategory
}

export default DbManager