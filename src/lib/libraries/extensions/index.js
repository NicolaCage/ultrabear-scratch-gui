import musicImage from './music.png';
import penImage from './pen.png';
import videoImage from './video-sensing.png';
import speechImage from './speech.png';
import microbitImage from './microbit.png';
import wedoImage from './wedo.png';
import ev3Image from './ev3.png';
import boostImage from './boost.png';

export default [
    {
        name: '音乐',
        extensionURL: 'music',
        iconURL: musicImage,
        description: '演奏乐器和鼓',
        featured: true
    },
    {
        name: '笔',
        extensionURL: 'pen',
        iconURL: penImage,
        description: '画你的精灵',
        featured: true
    },
    {
        name: 'Video Motion',
        extensionURL: 'videoSensing',
        iconURL: videoImage,
        description: 'Detect motion with the camera.',
        featured: true
    },
    {
        name: 'Speech Recognition',
        extensionURL: '',
        iconURL: speechImage,
        description: 'Talk to your projects.',
        featured: true,
        disabled: true
    },
    {
        name: 'Micro:bit',
        extensionURL: '',
        iconURL: microbitImage,
        description: 'Connect your projects with the physical world.',
        featured: true,
        disabled: true
    },
    {
        name: 'LEGO WeDo 2.0',
        extensionURL: '',
        iconURL: wedoImage,
        description: 'Build with motors and sensors.',
        featured: true,
        disabled: true
    },
    {
        name: 'LEGO Mindstorms EV3',
        extensionURL: '',
        iconURL: ev3Image,
        description: 'Build interactive robots and more.',
        featured: true,
        disabled: true
    },
    {
        name: 'LEGO Boost',
        extensionURL: '',
        iconURL: boostImage,
        description: 'Build with motors and sensors.',
        featured: true,
        disabled: true
    }
];
