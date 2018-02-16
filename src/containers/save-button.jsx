import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import VM from 'scratch-vm';
import xhr from 'xhr';
import md5 from 'md5';
import ButtonComponent from '../components/button/button.jsx';

class SaveButton extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleClick',
            'saveCostumes'
        ]);
    }
    handleClick () {
        // TODO: UltraBear
        // Even after we edit the stage costume in paint. The format of it is still png, not svg, which is actually svg now.
        // Is it a scratch bug or not consider format yet? I see a "Convert to Bitmap in paint area", seems not implemented.

        const json = this.props.saveProjectSb3();

        // Download project data into a file - create link element,
        // simulate click on it, and then remove it.
        const saveLink = document.createElement('a');
        document.body.appendChild(saveLink);

        const data = new Blob([json], {type: 'text'});
        const url = window.URL.createObjectURL(data);
        saveLink.href = url;

        // File name: project-DATE-TIME
        const date = new Date();
        const timestamp = `${date.toLocaleDateString()}-${date.toLocaleTimeString()}`;
        saveLink.download = `project-${timestamp}.json`;
        saveLink.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(saveLink);
        this.saveCostumes();
    }
    saveCostumes() {
        debugger
        if (!window.FormData) {
            throw new Error("Unsupported browser");
        }
        for (const key in this.props.sprites) {
            if (!this.props.sprites.hasOwnProperty(key)) continue;
            this.uploadSpriteCostumes(this.props.sprites[key]);
        }
        this.uploadStageCostumes(this.props.stage);
    }
    uploadSpriteCostumes(sprite) {
        this.uploadSVG(sprite, "http://localhost:8600/custumes");
    }
    uploadStageCostumes(sprite) {
        this.uploadSVG(sprite, "http://localhost:8600/backdrops");
    }
    uploadSVG(sprite, url) {
        if (!sprite || !sprite.costumes) return;
        for (let i = 0; i < sprite.costumes.length; i++) {
            let form = new window.FormData();
            let svgStr = this.props.vm.getSvg(sprite.costumes[i].assetId);
            let svg = new Blob([svgStr], {type:"image/svg+xml;charset=utf-8"});

            form.append('file', svg, "user_edited_"+md5(svg)+".svg");
            form.append('name', "user_edited_"+md5(svg));
            form.append('center_x', sprite.costumes[i].rotationCenterX);
            form.append('center_y', sprite.costumes[i].rotationCenterY);
            form.append('resolution', sprite.costumes[i].bitmapResolution);
            form.append('format', 'svg');
    
            xhr({
                method: "POST",
                url: url,
                body: form,
            }, (err, response, body) => {
                debugger
                if (!err) {
                    console.log("new svg saved");
                }
            });
        }
    }
    render () {
        const {
            saveProjectSb3, // eslint-disable-line no-unused-vars
            ...props
        } = this.props;
        return (
            <ButtonComponent
                onClick={this.handleClick}
                {...props}
            >
                Save
            </ButtonComponent>
        );
    }
}

SaveButton.propTypes = {
    saveProjectSb3: PropTypes.func.isRequired,
    vm: PropTypes.instanceOf(VM)
};

const mapStateToProps = state => ({
    sprites: state.targets.sprites,
    stage: state.targets.stage,
    vm: state.vm,
    saveProjectSb3: state.vm.saveProjectSb3.bind(state.vm)
});

export default connect(
    mapStateToProps,
    () => ({}) // omit dispatch prop
)(SaveButton);
