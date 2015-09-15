let LectureCode = {
    generate: () => {
        var text = "";
        var possible = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
        for( var i=0; i < 3; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    },
}

export default LectureCode;