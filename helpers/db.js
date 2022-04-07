import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase("grainCarts.db");

export const drop = () => {
    const promise = new Promise((resolve, reject) => {
    
        db.transaction((tx) => {
            tx.executeSql(
            "DROP TABLE grain_carts", 
            [],
            () => {
                resolve()
            },
            (_, err) => {
                reject(err)
            }
            );
        });
    
    })
    return promise;
}

export const deleteCart = (id) => {
    const promise = new Promise((resolve, reject) => {
    
        db.transaction((tx) => {
            tx.executeSql(
            "DELETE FROM grain_carts WHERE id = ?", 
            [id],
            () => {
                resolve()
            },
            (_, err) => {
                reject(err)
            }
            );
        });
    
    })
    return promise;

}

export const init = () => {

    const promise = new Promise((resolve, reject) => {
    
        db.transaction((tx) => {
            tx.executeSql(
            "CREATE TABLE IF NOT EXISTS grain_carts (id INTEGER PRIMARY KEY, name TEXT NOT NULL, imageUri TEXT NOT NULL, width TEXT NOT NULL, height REAL NOT NULL, length REAL NOT NULL);", 
            [],
            () => {
                resolve()
            },
            (_, err) => {
                reject(err)
            }
            );
        });
    
    })
    return promise;
}

export const insertCart = (Name, imageUri, width, height, length) => {
    
    const promise = new Promise((resolve, reject) => {
    
        db.transaction((tx) => {
            tx.executeSql(
            "INSERT INTO grain_carts(name, imageUri, width, height, length) VALUES (?,?,?,?,?)", 
            [Name, imageUri, width, height, length],
            (_, result) => {
                resolve(result)
            },
            (_, err) => {
                reject(err)
            }
            );
        });
    
    })
    return promise;
}

export const updateCarts = (Name, imageUri, width, height, length, id) => {

    const promise = new Promise((resolve, reject) => {
    
        db.transaction((tx) => {
            tx.executeSql(
            "UPDATE grain_carts SET name = (?), imageUri = (?), width = (?), height = (?), length = (?) WHERE id = (?) ", 
            [Name, imageUri, width, height, length, id],
            (_, result) => {
                resolve(result)
            },
            (_, err) => {
                reject(err)
            }
            );
        });

    })
    return promise

}

export const fetchCarts = () => {

    const promise = new Promise((resolve, reject) => {
    
        db.transaction((tx) => {
            tx.executeSql(
            "SELECT * FROM grain_carts", 
            [],
            (_, result) => {
                resolve(result)
            },
            (_, err) => {
                reject(err)
            }
            );
        });

    })
    return promise
    
}