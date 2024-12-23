import React, { useState } from 'react'
import cl from "./FacesMobileComponent.module.css"
import FaceBtn from '../../UI/FaceBtn/FaceBtn';
import fold from '../../assets/svgIcons/fold.svg';

function FacesMobileComponent({faces, selectedOptions, toggleOption}) {
    const [expanded, setExpanded] = useState({});
    const expandedStart = 4;

    // Функция для раскрытия опций в фильтре
    const toggleOptions = (index) => {
        setExpanded(prevState => ({
            ...prevState,
            [index]: !prevState[index]
        }));
    };

    // Обработчик события onWheel для предотвращения прокрутки внутри FacesComponent
    const handleWheel = (e) => {
        e.stopPropagation();
    };

    // Функция для получения отсортированных опций с учетом выбранных
    const getSortedOptions = (face) => {
        const selected = selectedOptions[face.title] || new Set();
        const unselectedOptions = face.options.filter(option => !selected.has(option.id));
        return [
            ...face.options.filter(option => selected.has(option.id)),
            ...unselectedOptions
        ];
    };

  return (
    <div className={cl.facesMobileComponent} onWheel={handleWheel}>
            {
                faces && faces.map((face, index) => (
                    <div className={cl.faceMobile} key={index}>
                        <div className={cl.faceMobile__title}>{face.title}</div>
                        <div className={cl.faceMobile__options}>
                            {
                                // Отображаем либо все опции либо только первые expandedStart опций
                                getSortedOptions(face).slice(0, expanded[index] ? face.options.length : expandedStart).map((faceOption) => (
                                    <FaceBtn
                                        key={faceOption.id}
                                        onClick={() => toggleOption(face.title, faceOption.id)}
                                        isActive={selectedOptions[face.title] && selectedOptions[face.title].has(faceOption.id)} // Проверяем, является ли текущая опция активной
                                        face={faceOption.url}
                                    />
                                ))
                            }
                        </div>
                        {
                            // Отображаем кнопку "Больше" или "Свернуть", если опций больше expandedStart
                            face.options.length > expandedStart && (
                                expanded[index]
                                    ?
                                    <div className={cl.fold} onClick={() => toggleOptions(index)}>
                                        <img src={fold} alt="fold" />
                                        <div className={cl.fold__text}>Свернуть</div>
                                    </div>
                                    :
                                    <div className={cl.expand} onClick={() => toggleOptions(index)}>Больше</div>
                            )
                        }
                    </div>
                ))
            }
        </div>
  )
}

export default FacesMobileComponent