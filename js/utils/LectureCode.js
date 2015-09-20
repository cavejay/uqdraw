let LectureCode = {
    generate: () => {
        var text = "";
        var possible = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789"; // No 0 or O
        for( var i=0; i < 3; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));
    },
}

export default LectureCode;
