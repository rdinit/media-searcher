import React, { useState } from 'react'
import cl from "./DragVideo.module.css"
import upload from "../../assets/svgIcons/upload.svg"
import UploadBtn from '../../UI/UploadBtn/UploadBtn'
import trash from "../../assets/svgIcons/trash.svg"
import errorImg from "../../assets/svgIcons/error.svg"
import successImg from "../../assets/svgIcons/success.svg"

function DragVideo({setVideoFile, isError, isSuccess, videoFile}) {
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState(' ');
  const [videoSrc, setVideoSrc] = useState(videoFile);

  //Функция начала перетаскивания
  function dragStartHandler(e){
    e.preventDefault();
    setDrag(true);
  }

  //Функция конца перетаскивания
  function dragLeaveHandler(e){
    e.preventDefault();
    setDrag(false);
  }

  //Функция, когда бросают в зону файл
  function onDropHandler(e){
    e.preventDefault();
    setDrag(false);
    setError('');
    setVideoSrc(null); // Сброс видео источника при новом дропе
    let file = e.dataTransfer.files[0];
    handleFile(file);
  }

  //Проверка корректности файла
  function handleFile(file){
    if (file && file.type === "video/mp4"){
      if(file.size > 250 * 1024 * 1024) {
        setError('Размер файла должен быть менее 250МБ.');
        return;
      }
      const video = document.createElement('video');
      video.preload = 'metadata';
  

      video.onloadedmetadata = function(){
        window.URL.revokeObjectURL(video.src);
        if(video.duration > 60){
          setError('Видео должно быть не более 1 минуты.');
        } else {
          setVideoSrc(URL.createObjectURL(file));
          setVideoFile(file);
        }
      }
      video.src = URL.createObjectURL(file);
    } else {
      setError("Можно загружать только файлы формата MP4.");
    }
    console.log(error);
  }

  // Функция для ввода файла через input
  function onFileInputChange(event) {
    const file = event.target.files[0];
    handleFile(file)
  }

  // Функция удаления видео
  function onDeleteHandler(){
    setVideoSrc(null);
  }

  return (
    <div>
      {
        drag 
        ? <div 
          className={cl.dropAreaDrag}
          onDragStart={e => dragStartHandler(e)}
          onDragLeave={e => dragLeaveHandler(e)}
          onDragOver={e => dragStartHandler(e)}
          onDrop={e => onDropHandler(e)}
          >Отпустите файл, чтобы загрузить его</div>
        :
        videoSrc 
        ? 
          <div className={isError || isSuccess ? `${cl.uploadedVideo} ${cl.darkVideo}` : cl.uploadedVideo}>
            <div className={cl.uploadedVideo__delete} onClick={() => onDeleteHandler()}>
              <img src={trash} alt='trash'/>
            </div>
            <video className={cl.video} loop preload='metadata' src={videoSrc} playsInline controls>
              Простите, но ваш браузер не поддерживает встроенные видео.
              Попробуйте скачать видео <a href={videoSrc}>по этой ссылке</a>
              и открыть его на своём устройстве.
            </video>
            {
              isError && (
                <div className={cl.error}>
                  <img src={errorImg} alt="error"/>
                  <div className={cl.error__text}>Error</div>
                </div>
              )
            }
            {
              isSuccess && (
                <div className={cl.success}>
                  <img src={successImg} alt="success"/>
                  <div className={cl.success__text}>Success</div>
                </div>
              )
            }
          </div>
        :
          <div 
            className={cl.dropArea}
            onDragStart={e => dragStartHandler(e)}
            onDragLeave={e => dragLeaveHandler(e)}
            onDragOver={e => dragStartHandler(e)}
          >
            <div className={cl.dragVideo__text}>
              <img src={upload} alt="upload" />
              <div className={cl.text}>Выберите или перетащите видео для загрузки</div>
              <div className={cl.format}>Формат MP4 <br/> Продолжительность видео <br/> от 3 до 60 секунд <br/> Размер менее 250МБ</div>
            </div>
            <UploadBtn width="149px" size="14px" onClick={() => document.getElementById('fileInput').click()}>Выберите файл</UploadBtn>
            <input
            id="fileInput"
            type='file'
            accept='video/mp4'
            style={{ display: 'none' }}
            onChange={onFileInputChange}
            />
          </div>
      }
      {error && <div className={cl.error}>{error}</div>}
    </div>
  )
}

export default DragVideo