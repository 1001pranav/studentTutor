const fs = require('fs');
const { getNullClassFiles, deleteFiles } = require("../src/library/sql/classFiles")

const cleanFiles = async () => {
    try {

        const [nullClassFiles] = await getNullClassFiles();
        const promises = [];
        for (let index = 0; index < nullClassFiles.length; index++) {
            const files = nullClassFiles[index];
            if (files.file_location) {
                fs.unlink(files.file_location, (err) => {
                    if (err) {
                        console.log("Error on deleting file", err);
                    }
                });
            }
            promises.push(deleteFiles(files.file_id));
        }
        await Promise.allSettled(promises);
    } catch (error) {
        console.log("Error: onCleanFiles", error);
    }
}

cleanFiles().then(()=> {

}).catch((err)=> {
    console.log("Error", err);
});
module.exports = cleanFiles;