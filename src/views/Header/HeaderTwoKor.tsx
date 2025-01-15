import React, { useState } from 'react';
import style from './HeaderTwo.module.scss';
import store from '../../redux/store'; // CP 1~7 참고하여 reducer로 관리하기
import { setHighlightedClass, clearHighlightedClass } from '../../redux/reducers/classHighlightReducer';
import { AutoComplete, Input, Select } from 'antd';

const options = [
    {
        label: 'Elements',
        options: [
            { value: 'L', label: '이준석' },
            { value: 'P', label: '박휘락' },
            { value: 'K', label: '김종대' },
            { value: 'J', label: '장경태' },
        ],
    },
];


interface HeaderProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Header({ isOpen, setIsOpen }: HeaderProps) {

    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    // const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const handleMouseEnter = (className: string) => {
        store.dispatch(setHighlightedClass({ className })); // Redux 상태 업데이트

        const state = store.getState();
    };

    const handleMouseLeave = () => {
        store.dispatch(clearHighlightedClass()); // Redux 상태 초기화
    };

    const handleSelect = (value: string) => {
        setSelectedItem(value);
        store.dispatch(setHighlightedClass({ className: value })); // Redux 상태 업데이트
    };

    const handleChange = (value: string) => {
        if (!value) {
            setSelectedItem(null);
            store.dispatch(clearHighlightedClass());
        }
    };

    // const handleChange = (value: string[]) => {
    //     setSelectedItems(value);
    //     if (value.length > 0) {
    //         store.dispatch(setHighlightedClass({ className: value[value.length - 1] })); // 마지막 선택 항목으로 Redux 업데이트
    //     } else {
    //         store.dispatch(clearHighlightedClass());
    //     }
    // };
    return (
        <div className={style.mainLink}>
            <div className={style.naviTwo}>
                <svg width="399" height="45" viewBox="0 0 399 45" fill="none" xmlns="http://www.w3.org/2000/svg" className={style.svg}>
                    <circle cx="78" cy="37" r="7" stroke="black" stroke-width="2" />
                    {/* 이준석 */}
                    <path
                        className="LJS"
                        d="M300 30C296.134 30 293 33.134 293 37"
                        stroke="#B60E3C"
                        strokeWidth="1.5"
                        // onMouseEnter={() => handleMouseEnter("L")}
                        // onMouseLeave={handleMouseLeave}
                    />
                    {/* 박휘락 */}
                    <path className="PHR" d="M307 37C307 33.134 303.866 30 300 30" stroke="#C7611E" strokeWidth="1.5" onMouseEnter={() => handleMouseEnter('P')} onMouseLeave={handleMouseLeave} />
                    {/* 김종대 */}
                    <path className="KJD" d="M300 44C303.866 44 307 40.866 307 37" stroke="#00A0E2" strokeWidth="1.5" onMouseEnter={() => handleMouseEnter('K')} onMouseLeave={handleMouseLeave} />
                    {/* 장경태 */}
                    <path className="JKT" d="M293 37C293 40.866 296.134 44 300 44" stroke="#00AB6E" strokeWidth="1.5" onMouseEnter={() => handleMouseEnter('J')} onMouseLeave={handleMouseLeave} />
                    <path
                        d="M148.09 28.9938C148.888 28.9938 149.586 29.2919 150.084 29.7888L151.181 30.882C152.277 31.9752 152.277 33.764 151.181 34.8571L150.782 35.2547L150.084 35.9503L150.782 36.646L151.181 37.0435C152.277 38.1366 152.277 39.9255 151.181 41.0186L150.084 42.1118C149.586 42.6087 148.788 42.9068 148.09 42.9068C147.293 42.9068 146.595 42.6087 146.097 42.1118L145.698 41.7143L145 41.0186L144.302 41.7143L143.903 42.1118C143.405 42.6087 142.707 42.9068 141.91 42.9068C141.112 42.9068 140.414 42.6087 139.916 42.1118L138.819 41.0186C138.321 40.5217 138.022 39.7267 138.022 39.0311C138.022 38.236 138.321 37.5404 138.819 37.0435L139.218 36.646L139.916 35.9503L139.218 35.2547L138.819 34.9565C137.723 33.8634 137.723 32.0745 138.819 30.9814L139.916 29.8882C140.414 29.3913 141.212 29.0932 141.91 29.0932C142.607 29.0932 143.405 29.3913 143.903 29.8882L144.302 30.2857L145 30.9814L145.698 30.2857L146.097 29.7888C146.595 29.2919 147.293 28.9938 148.09 28.9938ZM148.09 28C147.093 28 146.097 28.3975 145.399 29.0932L145 29.4907L144.701 29.0932C143.903 28.3975 142.907 28 142.009 28C141.012 28 140.016 28.3975 139.318 29.0932L138.121 30.2857C136.626 31.7764 136.626 34.1615 138.121 35.6522L138.421 35.9503L138.121 36.3478C136.626 37.8385 136.626 40.2236 138.121 41.7143L139.218 42.8075C139.916 43.5031 140.913 43.9006 141.91 43.9006C142.907 43.9006 143.903 43.5031 144.601 42.8075L145 42.5093L145.399 42.9068C146.097 43.6025 147.093 44 148.09 44C149.087 44 150.084 43.6025 150.782 42.9068L151.879 41.8137C153.374 40.323 153.374 37.9379 151.879 36.4472L151.48 36.0497L151.879 35.5528C153.374 34.0621 153.374 31.677 151.879 30.1863L150.782 29.0932C150.084 28.3975 149.087 28 148.09 28Z"
                        stroke="black"
                    />
                    <rect x="204" y="29" width="16" height="16" fill="#400000" />
                    <rect x="70" y="1" width="16" height="16" fill="#B60E3C" onMouseEnter={() => handleMouseEnter('L')} onMouseLeave={handleMouseLeave} />
                    <rect x="279" y="30.0607" width="9.81371" height="9.81371" rx="1.25" transform="rotate(45 279 30.0607)" stroke="#FF0606" stroke-width="1.5" />
                    <path
                        d="M95.472 32.746H96.984V33.236C96.984 35.602 95.836 37.702 93.372 38.472L92.462 37.016C94.562 36.358 95.472 34.804 95.472 33.236V32.746ZM95.808 32.746H97.334V33.236C97.334 34.678 98.216 36.176 100.316 36.792L99.42 38.248C96.97 37.534 95.808 35.49 95.808 33.236V32.746ZM92.924 31.822H99.882V33.278H92.924V31.822ZM95.472 30.38H97.334V32.396H95.472V30.38ZM100.904 30.282H102.766V39.886H100.904V30.282ZM102.234 34.118H104.488V35.63H102.234V34.118ZM94.408 41.538H103.228V43.022H94.408V41.538ZM94.408 39.046H96.27V42.504H94.408V39.046ZM108.449 30.954H110.003V32.116C110.003 34.72 108.841 37.002 106.293 37.856L105.327 36.358C107.539 35.644 108.449 33.894 108.449 32.116V30.954ZM108.841 30.954H110.339V32.032C110.339 33.754 111.179 35.35 113.237 36.008L112.271 37.464C109.877 36.638 108.841 34.552 108.841 32.032V30.954ZM114.427 30.282H116.289V37.87H114.427V30.282ZM111.893 38.206C114.637 38.206 116.331 39.144 116.331 40.726C116.331 42.322 114.637 43.246 111.893 43.246C109.149 43.246 107.455 42.322 107.455 40.726C107.455 39.144 109.149 38.206 111.893 38.206ZM111.893 39.648C110.213 39.648 109.317 39.998 109.317 40.726C109.317 41.454 110.213 41.818 111.893 41.818C113.587 41.818 114.483 41.454 114.483 40.726C114.483 39.998 113.587 39.648 111.893 39.648ZM112.061 32.634H114.693V34.146H112.061V32.634Z"
                        fill="black"
                    />
                    <path
                        d="M101.45 2.268H103.326V15.274H101.45V2.268ZM96.34 3.178C98.3 3.178 99.742 4.97 99.742 7.798C99.742 10.654 98.3 12.446 96.34 12.446C94.38 12.446 92.938 10.654 92.938 7.798C92.938 4.97 94.38 3.178 96.34 3.178ZM96.34 4.872C95.374 4.872 94.716 5.894 94.716 7.798C94.716 9.73 95.374 10.766 96.34 10.766C97.306 10.766 97.95 9.73 97.95 7.798C97.95 5.894 97.306 4.872 96.34 4.872ZM110.017 3.654H111.669V3.962C111.669 6.02 109.933 7.756 106.629 8.134L105.957 6.664C108.771 6.356 110.017 5.082 110.017 3.962V3.654ZM110.927 3.654H112.579V3.962C112.579 5.096 113.839 6.356 116.653 6.664L115.967 8.134C112.677 7.756 110.927 6.034 110.927 3.962V3.654ZM106.503 2.842H116.107V4.298H106.503V2.842ZM105.439 8.736H117.171V10.22H105.439V8.736ZM110.521 9.674H112.397V12.404H110.521V9.674ZM106.797 13.538H115.883V15.022H106.797V13.538ZM106.797 11.298H108.645V14.056H106.797V11.298ZM124.94 4.69H127.572V6.202H124.94V4.69ZM121.286 2.954H122.812V4.172C122.812 6.734 121.678 8.96 119.214 9.814L118.234 8.344C120.404 7.63 121.286 5.922 121.286 4.172V2.954ZM121.664 2.954H123.162V4.284C123.162 5.894 124.03 7.476 126.06 8.134L125.094 9.59C122.742 8.778 121.664 6.678 121.664 4.284V2.954ZM120.334 10.584H129.168V15.246H127.306V12.054H120.334V10.584ZM127.306 2.282H129.168V9.996H127.306V2.282Z"
                        fill="black"
                    />
                    <rect x="137" y="1" width="16" height="16" fill="#C7611E" onMouseEnter={() => handleMouseEnter('P')} onMouseLeave={handleMouseLeave} />
                    <path
                        d="M167.904 2.282H169.766V10.052H167.904V2.282ZM169.248 5.432H171.488V6.958H169.248V5.432ZM161.114 10.626H169.766V15.246H167.904V12.11H161.114V10.626ZM159.938 3.094H161.786V4.802H164.32V3.094H166.168V9.394H159.938V3.094ZM161.786 6.23V7.938H164.32V6.23H161.786ZM175.715 10.85H177.577V15.036H175.715V10.85ZM181.441 2.296H183.289V15.26H181.441V2.296ZM172.719 11.76L172.509 10.29C174.987 10.29 178.053 10.276 180.741 9.982L180.867 11.312C178.067 11.732 175.141 11.76 172.719 11.76ZM172.859 3.514H180.447V4.928H172.859V3.514ZM176.653 5.292C178.515 5.292 179.817 6.174 179.817 7.49C179.817 8.806 178.515 9.702 176.653 9.702C174.777 9.702 173.475 8.806 173.475 7.49C173.475 6.174 174.777 5.292 176.653 5.292ZM176.653 6.65C175.799 6.65 175.239 6.93 175.239 7.49C175.239 8.05 175.799 8.33 176.653 8.33C177.493 8.33 178.053 8.05 178.053 7.49C178.053 6.93 177.493 6.65 176.653 6.65ZM175.715 2.184H177.577V4.41H175.715V2.184ZM185.78 8.204H186.872C189.42 8.204 190.988 8.148 192.78 7.812L192.948 9.296C191.128 9.646 189.49 9.716 186.872 9.716H185.78V8.204ZM185.766 2.996H191.688V6.986H187.628V8.918H185.78V5.6H189.854V4.48H185.766V2.996ZM193.662 2.296H195.524V10.164H193.662V2.296ZM194.992 5.376H197.246V6.902H194.992V5.376ZM186.872 10.752H195.524V15.246H193.662V12.236H186.872V10.752Z"
                        fill="black"
                    />
                    <rect x="204" y="1" width="16" height="16" fill="#00AB6E" onMouseEnter={() => handleMouseEnter('K')} onMouseLeave={handleMouseLeave} />
                    <path
                        d="M231.432 3.024H233.392C233.392 6.468 231.194 8.806 227.33 9.8L226.63 8.344C229.808 7.546 231.432 5.894 231.432 3.948V3.024ZM227.372 3.024H232.636V4.48H227.372V3.024ZM235.464 2.282H237.34V9.506H235.464V2.282ZM228.758 10.052H237.34V15.106H228.758V10.052ZM235.506 11.522H230.592V13.636H235.506V11.522ZM244.353 6.93H246.201V9.254H244.353V6.93ZM239.439 8.484H251.157V9.954H239.439V8.484ZM245.277 10.668C248.091 10.668 249.771 11.494 249.771 12.964C249.771 14.434 248.091 15.246 245.277 15.246C242.463 15.246 240.769 14.434 240.769 12.964C240.769 11.494 242.463 10.668 245.277 10.668ZM245.277 12.068C243.527 12.068 242.659 12.348 242.659 12.964C242.659 13.594 243.527 13.86 245.277 13.86C247.027 13.86 247.895 13.594 247.895 12.964C247.895 12.348 247.027 12.068 245.277 12.068ZM244.017 3.5H245.669V3.822C245.669 5.768 243.919 7.35 240.573 7.672L239.929 6.202C242.771 5.964 244.017 4.83 244.017 3.822V3.5ZM244.927 3.5H246.579V3.822C246.579 4.83 247.811 5.964 250.667 6.202L250.023 7.672C246.691 7.35 244.927 5.782 244.927 3.822V3.5ZM240.503 2.814H250.107V4.284H240.503V2.814ZM261.684 2.282H263.448V15.246H261.684V2.282ZM259.948 7.266H262.104V8.764H259.948V7.266ZM258.786 2.506H260.508V14.63H258.786V2.506ZM252.682 10.794H253.592C255.188 10.794 256.518 10.738 258.058 10.458L258.198 11.97C256.63 12.278 255.258 12.32 253.592 12.32H252.682V10.794ZM252.682 3.78H257.47V5.278H254.53V11.522H252.682V3.78Z"
                        fill="black"
                    />
                    <rect x="271" y="1" width="16" height="16" fill="#00A0E2" onMouseEnter={() => handleMouseEnter('J')} onMouseLeave={handleMouseLeave} />
                    <path
                        d="M296.444 3.724H297.97V4.536C297.97 7.014 296.808 9.24 294.302 10.066L293.378 8.596C295.534 7.882 296.444 6.188 296.444 4.536V3.724ZM296.822 3.724H298.334V4.536C298.334 6.048 299.202 7.532 301.288 8.162L300.406 9.618C297.942 8.876 296.822 6.846 296.822 4.536V3.724ZM293.868 3.15H300.868V4.634H293.868V3.15ZM301.904 2.282H303.766V9.968H301.904V2.282ZM303.248 5.264H305.488V6.79H303.248V5.264ZM299.538 10.206C302.226 10.206 303.92 11.144 303.92 12.726C303.92 14.308 302.226 15.246 299.538 15.246C296.836 15.246 295.142 14.308 295.142 12.726C295.142 11.144 296.836 10.206 299.538 10.206ZM299.538 11.662C297.886 11.662 296.99 11.998 296.99 12.726C296.99 13.454 297.886 13.818 299.538 13.818C301.19 13.818 302.072 13.454 302.072 12.726C302.072 11.998 301.19 11.662 299.538 11.662ZM312.683 4.326H315.721V5.81H312.683V4.326ZM312.585 7.014H315.623V8.498H312.585V7.014ZM315.427 2.282H317.289V9.744H315.427V2.282ZM311.199 3.164H313.187C313.187 6.692 311.199 8.96 307.265 10.038L306.537 8.568C309.827 7.714 311.199 6.09 311.199 4.06V3.164ZM307.251 3.164H312.501V4.648H307.251V3.164ZM312.991 9.912C315.623 9.912 317.373 10.92 317.373 12.544C317.373 14.168 315.623 15.19 312.991 15.19C310.359 15.19 308.609 14.168 308.609 12.544C308.609 10.92 310.359 9.912 312.991 9.912ZM312.991 11.34C311.409 11.34 310.457 11.746 310.457 12.544C310.457 13.342 311.409 13.734 312.991 13.734C314.587 13.734 315.539 13.342 315.539 12.544C315.539 11.746 314.587 11.34 312.991 11.34ZM319.752 10.752H320.662C322.552 10.752 323.756 10.724 325.212 10.5L325.366 12.012C323.882 12.264 322.594 12.292 320.662 12.292H319.752V10.752ZM319.752 3.626H324.988V5.11H321.516V11.368H319.752V3.626ZM321.012 7.014H324.736V8.456H321.012V7.014ZM328.684 2.282H330.462V15.246H328.684V2.282ZM327.13 7.294H329.272V8.792H327.13V7.294ZM325.884 2.478H327.634V14.658H325.884V2.478Z"
                        fill="black"
                    />
                    <rect x="338" y="1" width="16" height="16" fill="#808080" />
                    <path
                        d="M363.71 3.724H365.25V4.816C365.25 7.266 364.06 9.478 361.568 10.29L360.616 8.834C362.772 8.134 363.71 6.454 363.71 4.816V3.724ZM364.088 3.724H365.614V4.816C365.614 6.356 366.538 7.938 368.652 8.61L367.7 10.052C365.264 9.282 364.088 7.168 364.088 4.816V3.724ZM361.106 3.206H368.162V4.676H361.106V3.206ZM369.464 2.296H371.34V11.648H369.464V2.296ZM362.702 13.538H371.662V15.022H362.702V13.538ZM362.702 10.808H364.564V14.28H362.702V10.808ZM382.721 2.282H384.485V10.402H382.721V2.282ZM381.139 5.474H383.211V6.986H381.139V5.474ZM380.033 2.534H381.769V9.982H380.033V2.534ZM373.383 3.612H379.669V5.04H373.383V3.612ZM376.547 5.46C378.171 5.46 379.347 6.384 379.347 7.728C379.347 9.072 378.171 9.982 376.547 9.982C374.923 9.982 373.747 9.072 373.747 7.728C373.747 6.384 374.923 5.46 376.547 5.46ZM376.547 6.79C375.861 6.79 375.399 7.126 375.399 7.728C375.399 8.33 375.861 8.666 376.547 8.666C377.219 8.666 377.681 8.33 377.681 7.728C377.681 7.126 377.219 6.79 376.547 6.79ZM375.609 2.408H377.443V4.592H375.609V2.408ZM380.103 10.542C382.875 10.542 384.555 11.382 384.555 12.894C384.555 14.392 382.875 15.246 380.103 15.246C377.317 15.246 375.637 14.392 375.637 12.894C375.637 11.382 377.317 10.542 380.103 10.542ZM380.103 11.928C378.367 11.928 377.499 12.222 377.499 12.894C377.499 13.552 378.367 13.86 380.103 13.86C381.825 13.86 382.693 13.552 382.693 12.894C382.693 12.222 381.825 11.928 380.103 11.928ZM389.23 4.326H390.7V5.782C390.7 8.708 389.468 11.69 387.088 12.81L386.038 11.34C388.18 10.332 389.23 7.91 389.23 5.782V4.326ZM389.622 4.326H391.092V5.782C391.092 7.742 392.1 10.038 394.228 11.018L393.206 12.488C390.826 11.382 389.622 8.54 389.622 5.782V4.326ZM386.542 3.528H393.654V5.054H386.542V3.528ZM394.606 2.282H396.482V15.246H394.606V2.282ZM396.062 7.224H398.358V8.764H396.062V7.224Z"
                        fill="black"
                    />
                    <path
                        d="M0.884943 14V3.81818H3.03764V12.2251H7.4027V14H0.884943ZM12.2686 14.1491C11.4831 14.1491 10.807 13.9901 10.2402 13.6719C9.67679 13.3504 9.2426 12.8963 8.93768 12.3097C8.63275 11.7197 8.48029 11.022 8.48029 10.2166C8.48029 9.43111 8.63275 8.74171 8.93768 8.14844C9.2426 7.55516 9.67182 7.0928 10.2253 6.76136C10.7821 6.42992 11.4351 6.2642 12.1841 6.2642C12.6879 6.2642 13.1569 6.34541 13.5911 6.50781C14.0286 6.6669 14.4097 6.9072 14.7346 7.22869C15.0627 7.55019 15.3179 7.95455 15.5002 8.44176C15.6825 8.92566 15.7736 9.49242 15.7736 10.142V10.7237H9.32546V9.41122H13.78C13.78 9.1063 13.7137 8.83617 13.5811 8.60085C13.4486 8.36553 13.2646 8.18158 13.0293 8.04901C12.7973 7.91312 12.5272 7.84517 12.2189 7.84517C11.8974 7.84517 11.6124 7.91974 11.3638 8.06889C11.1185 8.21473 10.9263 8.41193 10.7871 8.66051C10.6479 8.90578 10.5766 9.17921 10.5733 9.48082V10.7287C10.5733 11.1065 10.6429 11.433 10.7821 11.7081C10.9247 11.9832 11.1252 12.1953 11.3837 12.3445C11.6422 12.4936 11.9488 12.5682 12.3034 12.5682C12.5388 12.5682 12.7542 12.535 12.9498 12.4688C13.1453 12.4025 13.3127 12.303 13.4519 12.1705C13.5911 12.0379 13.6971 11.8755 13.7701 11.6832L15.7289 11.8125C15.6294 12.2831 15.4256 12.6941 15.1174 13.0455C14.8124 13.3935 14.418 13.6652 13.9341 13.8608C13.4535 14.053 12.8984 14.1491 12.2686 14.1491ZM20.5961 17.0227C19.91 17.0227 19.3217 16.9283 18.8311 16.7393C18.3439 16.5537 17.9561 16.3002 17.6678 15.9787C17.3794 15.6572 17.1922 15.2959 17.106 14.8949L19.0648 14.6314C19.1245 14.7839 19.2189 14.9264 19.3482 15.0589C19.4775 15.1915 19.6481 15.2976 19.8603 15.3771C20.0757 15.46 20.3375 15.5014 20.6458 15.5014C21.1065 15.5014 21.486 15.3887 21.7843 15.1634C22.0859 14.9413 22.2367 14.5684 22.2367 14.0447V12.6477H22.1472C22.0544 12.8598 21.9152 13.0604 21.7296 13.2493C21.544 13.4382 21.3053 13.5923 21.0137 13.7116C20.722 13.831 20.374 13.8906 19.9696 13.8906C19.3962 13.8906 18.8742 13.758 18.4036 13.4929C17.9363 13.2244 17.5634 12.8151 17.285 12.2649C17.0099 11.7114 16.8723 11.0121 16.8723 10.1669C16.8723 9.30185 17.0132 8.57931 17.2949 7.99929C17.5766 7.41927 17.9512 6.98509 18.4185 6.69673C18.8891 6.40838 19.4045 6.2642 19.9647 6.2642C20.3922 6.2642 20.7502 6.33712 21.0385 6.48295C21.3269 6.62547 21.5589 6.80445 21.7346 7.01989C21.9135 7.23201 22.0511 7.44081 22.1472 7.64631H22.2267V6.36364H24.3297V14.0746C24.3297 14.7242 24.1706 15.2678 23.8525 15.7053C23.5343 16.1428 23.0935 16.4709 22.53 16.6896C21.9699 16.9117 21.3252 17.0227 20.5961 17.0227ZM20.6408 12.2997C20.9822 12.2997 21.2705 12.2152 21.5059 12.0462C21.7445 11.8738 21.9268 11.6286 22.0527 11.3104C22.182 10.9889 22.2466 10.6044 22.2466 10.157C22.2466 9.70952 22.1837 9.32173 22.0577 8.99361C21.9318 8.66217 21.7495 8.4053 21.5108 8.22301C21.2722 8.04072 20.9822 7.94957 20.6408 7.94957C20.2928 7.94957 19.9995 8.04403 19.7608 8.23295C19.5222 8.41856 19.3416 8.67708 19.2189 9.00852C19.0963 9.33996 19.035 9.72277 19.035 10.157C19.035 10.5978 19.0963 10.9789 19.2189 11.3004C19.3449 11.6186 19.5255 11.8655 19.7608 12.0412C19.9995 12.2135 20.2928 12.2997 20.6408 12.2997ZM29.4952 14.1491C28.7097 14.1491 28.0336 13.9901 27.4668 13.6719C26.9033 13.3504 26.4692 12.8963 26.1642 12.3097C25.8593 11.7197 25.7069 11.022 25.7069 10.2166C25.7069 9.43111 25.8593 8.74171 26.1642 8.14844C26.4692 7.55516 26.8984 7.0928 27.4519 6.76136C28.0087 6.42992 28.6616 6.2642 29.4107 6.2642C29.9145 6.2642 30.3835 6.34541 30.8176 6.50781C31.2551 6.6669 31.6363 6.9072 31.9611 7.22869C32.2892 7.55019 32.5444 7.95455 32.7267 8.44176C32.909 8.92566 33.0002 9.49242 33.0002 10.142V10.7237H26.552V9.41122H31.0066C31.0066 9.1063 30.9403 8.83617 30.8077 8.60085C30.6751 8.36553 30.4912 8.18158 30.2559 8.04901C30.0239 7.91312 29.7537 7.84517 29.4455 7.84517C29.124 7.84517 28.839 7.91974 28.5904 8.06889C28.3451 8.21473 28.1529 8.41193 28.0137 8.66051C27.8745 8.90578 27.8032 9.17921 27.7999 9.48082V10.7287C27.7999 11.1065 27.8695 11.433 28.0087 11.7081C28.1512 11.9832 28.3517 12.1953 28.6103 12.3445C28.8688 12.4936 29.1754 12.5682 29.53 12.5682C29.7653 12.5682 29.9808 12.535 30.1763 12.4688C30.3719 12.4025 30.5392 12.303 30.6784 12.1705C30.8176 12.0379 30.9237 11.8755 30.9966 11.6832L32.9554 11.8125C32.856 12.2831 32.6522 12.6941 32.3439 13.0455C32.039 13.3935 31.6446 13.6652 31.1607 13.8608C30.6801 14.053 30.1249 14.1491 29.4952 14.1491ZM36.5002 9.58523V14H34.3823V6.36364H36.4007V7.71094H36.4902C36.6593 7.26681 36.9426 6.91548 37.3404 6.65696C37.7381 6.39512 38.2203 6.2642 38.7871 6.2642C39.3174 6.2642 39.7798 6.38021 40.1742 6.61222C40.5686 6.84422 40.8752 7.17566 41.0939 7.60653C41.3127 8.03409 41.4221 8.54451 41.4221 9.13778V14H39.3042V9.51562C39.3075 9.0483 39.1882 8.68371 38.9462 8.42188C38.7042 8.15672 38.3712 8.02415 37.9469 8.02415C37.6619 8.02415 37.41 8.08546 37.1912 8.2081C36.9758 8.33073 36.8068 8.50971 36.6841 8.74503C36.5648 8.97704 36.5035 9.2571 36.5002 9.58523ZM45.9052 14.1243C45.3252 14.1243 44.7998 13.9751 44.3292 13.6768C43.8619 13.3752 43.4906 12.9328 43.2156 12.3494C42.9438 11.7628 42.8079 11.0436 42.8079 10.1918C42.8079 9.31676 42.9487 8.58925 43.2305 8.00923C43.5122 7.4259 43.8867 6.99006 44.354 6.7017C44.8247 6.41004 45.3401 6.2642 45.9002 6.2642C46.3278 6.2642 46.6841 6.33712 46.9691 6.48295C47.2575 6.62547 47.4895 6.80445 47.6651 7.01989C47.8441 7.23201 47.98 7.44081 48.0728 7.64631H48.1374V3.81818H50.2504V14H48.1623V12.777H48.0728C47.9734 12.9891 47.8325 13.1996 47.6502 13.4084C47.4712 13.6139 47.2376 13.7846 46.9492 13.9205C46.6642 14.0563 46.3162 14.1243 45.9052 14.1243ZM46.5763 12.4389C46.9177 12.4389 47.2061 12.3461 47.4414 12.1605C47.68 11.9716 47.8623 11.7081 47.9883 11.37C48.1175 11.032 48.1822 10.6359 48.1822 10.1818C48.1822 9.72775 48.1192 9.33333 47.9933 8.99858C47.8673 8.66383 47.685 8.4053 47.4464 8.22301C47.2077 8.04072 46.9177 7.94957 46.5763 7.94957C46.2283 7.94957 45.935 8.04403 45.6964 8.23295C45.4577 8.42187 45.2771 8.68371 45.1545 9.01847C45.0318 9.35322 44.9705 9.741 44.9705 10.1818C44.9705 10.6259 45.0318 11.0187 45.1545 11.3601C45.2804 11.6982 45.4611 11.9633 45.6964 12.1555C45.935 12.3445 46.2283 12.4389 46.5763 12.4389ZM58.3453 8.54119L56.4064 8.66051C56.3733 8.49479 56.302 8.34564 56.1926 8.21307C56.0833 8.07718 55.9391 7.96946 55.7601 7.88991C55.5845 7.80705 55.374 7.76562 55.1287 7.76562C54.8006 7.76562 54.5239 7.83523 54.2985 7.97443C54.0731 8.11032 53.9604 8.29261 53.9604 8.52131C53.9604 8.7036 54.0333 8.85772 54.1792 8.98366C54.325 9.10961 54.5752 9.2107 54.9299 9.28693L56.312 9.56534C57.0544 9.7178 57.6079 9.96307 57.9725 10.3011C58.3371 10.6392 58.5194 11.0833 58.5194 11.6335C58.5194 12.134 58.3719 12.5732 58.0769 12.951C57.7852 13.3288 57.3842 13.6238 56.8738 13.8359C56.3667 14.0447 55.7817 14.1491 55.1188 14.1491C54.1079 14.1491 53.3025 13.9387 52.7026 13.5178C52.106 13.0935 51.7563 12.5168 51.6536 11.7876L53.7367 11.6783C53.7997 11.9865 53.9521 12.2218 54.1941 12.3842C54.436 12.5433 54.7459 12.6229 55.1238 12.6229C55.495 12.6229 55.7933 12.5516 56.0186 12.4091C56.2473 12.2633 56.3633 12.076 56.3667 11.8473C56.3633 11.6551 56.2821 11.4976 56.123 11.375C55.964 11.2491 55.7187 11.1529 55.3873 11.0866L54.0648 10.8232C53.3191 10.674 52.7639 10.4155 52.3993 10.0476C52.0381 9.67969 51.8574 9.2107 51.8574 8.64062C51.8574 8.15009 51.99 7.72751 52.2551 7.37287C52.5236 7.01823 52.8998 6.74479 53.3837 6.55256C53.8709 6.36032 54.441 6.2642 55.0939 6.2642C56.0584 6.2642 56.8174 6.46804 57.3709 6.87571C57.9277 7.28338 58.2525 7.83854 58.3453 8.54119ZM61.0909 14.1293C60.7628 14.1293 60.4811 14.0133 60.2457 13.7812C60.0137 13.5459 59.8977 13.2642 59.8977 12.9361C59.8977 12.6113 60.0137 12.3329 60.2457 12.1009C60.4811 11.8688 60.7628 11.7528 61.0909 11.7528C61.4091 11.7528 61.6875 11.8688 61.9261 12.1009C62.1648 12.3329 62.2841 12.6113 62.2841 12.9361C62.2841 13.1548 62.2277 13.3554 62.1151 13.5376C62.0057 13.7166 61.8615 13.8608 61.6825 13.9702C61.5036 14.0762 61.3063 14.1293 61.0909 14.1293ZM61.0909 8.77983C60.7628 8.77983 60.4811 8.66383 60.2457 8.43182C60.0137 8.19981 59.8977 7.91809 59.8977 7.58665C59.8977 7.26184 60.0137 6.98509 60.2457 6.75639C60.4811 6.52438 60.7628 6.40838 61.0909 6.40838C61.4091 6.40838 61.6875 6.52438 61.9261 6.75639C62.1648 6.98509 62.2841 7.26184 62.2841 7.58665C62.2841 7.80871 62.2277 8.01089 62.1151 8.19318C62.0057 8.37216 61.8615 8.51468 61.6825 8.62074C61.5036 8.7268 61.3063 8.77983 61.0909 8.77983Z"
                        fill="black"
                    />
                    <path
                        d="M167.904 30.296H169.766V39.83H167.904V30.296ZM169.234 33.936H171.488V35.462H169.234V33.936ZM161.408 41.538H170.228V43.022H161.408V41.538ZM161.408 38.864H163.27V41.86H161.408V38.864ZM159.938 31.206H161.786V33.068H164.32V31.206H166.168V37.786H159.938V31.206ZM161.786 34.482V36.33H164.32V34.482H161.786ZM181.805 30.282H183.569V43.246H181.805V30.282ZM180.069 35.266H182.225V36.764H180.069V35.266ZM178.907 30.506H180.629V42.63H178.907V30.506ZM172.803 38.794H173.713C175.309 38.794 176.639 38.738 178.179 38.458L178.319 39.97C176.751 40.278 175.379 40.32 173.713 40.32H172.803V38.794ZM172.803 31.78H177.591V33.278H174.651V39.522H172.803V31.78Z"
                        fill="black"
                    />
                    <path
                        d="M228.03 33.754H236.976V35.224H228.03V33.754ZM228.03 30.632H229.878V34.342H228.03V30.632ZM226.574 36.778H238.306V38.262H226.574V36.778ZM231.516 34.636H233.364V37.226H231.516V34.636ZM227.946 41.538H237.088V43.022H227.946V41.538ZM227.946 39.06H229.794V42.294H227.946V39.06ZM241.707 31.99H243.163V32.802C243.163 35.014 242.323 37.058 240.237 37.884L239.271 36.47C241.021 35.756 241.707 34.286 241.707 32.802V31.99ZM242.071 31.99H243.499V32.802C243.499 34.23 244.143 35.518 245.753 36.148L244.801 37.576C242.841 36.792 242.071 34.944 242.071 32.802V31.99ZM239.691 31.234H245.431V32.718H239.691V31.234ZM248.721 30.296H250.485V38.136H248.721V30.296ZM247.167 33.404H249.225V34.902H247.167V33.404ZM246.019 30.534H247.755V37.744H246.019V30.534ZM246.089 38.332C248.805 38.332 250.555 39.256 250.555 40.796C250.555 42.322 248.805 43.246 246.089 43.246C243.359 43.246 241.637 42.322 241.637 40.796C241.637 39.256 243.359 38.332 246.089 38.332ZM246.089 39.746C244.423 39.746 243.485 40.096 243.485 40.796C243.485 41.496 244.423 41.832 246.089 41.832C247.755 41.832 248.679 41.496 248.679 40.796C248.679 40.096 247.755 39.746 246.089 39.746Z"
                        fill="black"
                    />
                    <path
                        d="M315.03 33.754H323.976V35.224H315.03V33.754ZM315.03 30.632H316.878V34.342H315.03V30.632ZM313.574 36.778H325.306V38.262H313.574V36.778ZM318.516 34.636H320.364V37.226H318.516V34.636ZM314.946 41.538H324.088V43.022H314.946V41.538ZM314.946 39.06H316.794V42.294H314.946V39.06ZM328.707 31.99H330.163V32.802C330.163 35.014 329.323 37.058 327.237 37.884L326.271 36.47C328.021 35.756 328.707 34.286 328.707 32.802V31.99ZM329.071 31.99H330.499V32.802C330.499 34.23 331.143 35.518 332.753 36.148L331.801 37.576C329.841 36.792 329.071 34.944 329.071 32.802V31.99ZM326.691 31.234H332.431V32.718H326.691V31.234ZM335.721 30.296H337.485V38.136H335.721V30.296ZM334.167 33.404H336.225V34.902H334.167V33.404ZM333.019 30.534H334.755V37.744H333.019V30.534ZM333.089 38.332C335.805 38.332 337.555 39.256 337.555 40.796C337.555 42.322 335.805 43.246 333.089 43.246C330.359 43.246 328.637 42.322 328.637 40.796C328.637 39.256 330.359 38.332 333.089 38.332ZM333.089 39.746C331.423 39.746 330.485 40.096 330.485 40.796C330.485 41.496 331.423 41.832 333.089 41.832C334.755 41.832 335.679 41.496 335.679 40.796C335.679 40.096 334.755 39.746 333.089 39.746ZM340.662 31.038H348.796V32.508H340.662V31.038ZM339.332 36.554H351.05V38.052H339.332V36.554ZM344.19 37.604H346.066V43.26H344.19V37.604ZM347.844 31.038H349.678V32.186C349.678 33.586 349.678 35.154 349.174 37.45L347.34 37.24C347.844 35.07 347.844 33.53 347.844 32.186V31.038ZM360.527 30.282H362.403V39.564H360.527V30.282ZM361.871 33.894H364.125V35.42H361.871V33.894ZM356.915 31.248H358.903C358.903 34.776 356.747 37.198 352.883 38.318L352.099 36.834C355.277 35.966 356.915 34.23 356.915 32.172V31.248ZM352.659 31.248H357.923V32.746H352.659V31.248ZM354.017 41.538H362.837V43.022H354.017V41.538ZM354.017 38.626H355.893V42.196H354.017V38.626Z"
                        fill="black"
                    />
                </svg>

                <button
                    onClick={() => setIsOpen((prev) => !prev)}
                    style={{
                        marginLeft: '20px',
                        marginBottom: '15px',
                        background: '#9c27b0',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                    }}
                >
                    {isOpen ? 'Hide Script' : 'View Script'}
                </button>
                <AutoComplete style={{ width: 150, marginLeft: 20, marginBottom: -10 }} options={options} placeholder="" onSelect={handleSelect} onChange={handleChange} allowClear>
                    <Input.Search size="middle" placeholder="Select Debater" />
                </AutoComplete>
                {/* <Select
                    mode="multiple"
                    allowClear
                    style={{ width: 150, marginLeft: 20, marginBottom: -10 }}
                    placeholder="Select Names"
                    onChange={handleChange}
                    options={options}
                    value={selectedItems}
                /> */}
            </div>
        </div>
    );
}
