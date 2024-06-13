


document.getElementById('uploadButton').addEventListener('click', function () {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', function () {
    document.getElementById('uploadForm').submit();
});

// function photoesClick(e){

//     e.preventDefault();

//     console.log('pht click');
    
//     const mediaPhotos =document.getElementsByClassName('media-photos')[0];
//     mediaPhotos.style.color="white";
//     mediaPhotos.style.backgroundColor="#0d6efd";

//     const mediaAll =document.getElementsByClassName('media-all')[0];
//     mediaAll.style.backgroundColor="white";
//     mediaAll.style.color="#0d6efd";
    
//     const mediaVideos =document.getElementsByClassName('media-videos')[0];
//     mediaVideos.style.color="#0d6efd";
//     mediaVideos.style.backgroundColor="white";
// }
// const mediaPhotos =document.getElementsByClassName('media-photos')[0];
// mediaPhotos.addEventListener('click',photoesClick);

// function videosClick(e){
//     e.preventDefault();
//     console.log('video click');

//     const mediaPhotos =document.getElementsByClassName('media-photos')[0];
//     mediaPhotos.style.color="#0d6efd";
//     mediaPhotos.style.backgroundColor="white";

//     const mediaAll =document.getElementsByClassName('media-all')[0];
//     mediaAll.style.backgroundColor="white";
//     mediaAll.style.color="#0d6efd";
    
//     const mediaVideos =document.getElementsByClassName('media-videos')[0];
    
//     mediaVideos.style.color="white";
//     mediaVideos.style.backgroundColor="#0d6efd";
// }
// const mediaVideos =document.getElementsByClassName('media-videos')[0];
// mediaVideos.addEventListener('click',videosClick);