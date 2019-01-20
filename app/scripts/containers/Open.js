import kdbxweb from 'kdbxweb';
import { connect } from 'react-redux';
import { getOpenRows } from 'selectors/open';
import { getLastFiles } from 'selectors/files';
import { Open } from 'components/Open';
import { setView } from 'store/ui/set-view';
import { toggleSecondRow } from 'store/ui/open/toggle-second-row';
import { moveFileSelection } from 'logic/ui/open/move-file-selection';
import { loadFileContent, loadKeyFileContent } from 'logic/ui/open/load-files';
import { loadKeyFileFromDropbox } from 'logic/ui/open/load-key-file-from-dropbox';
import { removeLastFile } from 'logic/ui/open/remove-last-file';
import { resetKeyFile } from 'store/ui/open/reset-key-file';
import { displayLastFile } from 'logic/ui/open/display-last-file';
import { openFile } from 'logic/ui/open/open-file';
import { loadDroppedFiles } from 'logic/ui/open/load-dropped-files';

const mapStateToProps = state => {
    return {
        secondRowVisible: state.uiOpen.secondRowVisible,
        file: state.uiOpen.file,
        busy: state.uiOpen.busy,
        loading: state.uiOpen.loading,
        error: state.uiOpen.error,
        locale: state.locale,
        canOpen: state.settings.canOpen,
        canRemoveLatest: state.settings.canRemoveLatest,
        canOpenKeyFromDropbox: !!state.settings.dropbox,
        lastFiles: getLastFiles(state),
        rows: getOpenRows(state),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onClick({ button }) {
            switch (button) {
                case 'more':
                    return dispatch(toggleSecondRow());
                case 'settings':
                    return dispatch(setView('settings'));
            }
        },
        onFileClick({ id }) {
            dispatch(displayLastFile(id));
        },
        onFileSelect({ button, file }) {
            switch (button) {
                case 'open':
                    dispatch(loadFileContent(file));
                    break;
                case 'keyfile':
                    dispatch(loadKeyFileContent(file));
                    break;
                default:
                    throw new Error(`Unexpected button: ${button}`);
            }
        },
        onDropboxKeyFileClick() {
            dispatch(loadKeyFileFromDropbox());
        },
        onKeyFileDeselect() {
            dispatch(resetKeyFile());
        },
        onFileDeleteClick({ id }) {
            dispatch(removeLastFile(id));
        },
        onPreviousFileSelect() {
            dispatch(moveFileSelection(-1));
        },
        onNextFileSelect() {
            dispatch(moveFileSelection(1));
        },
        onOpenRequest({ password }) {
            password = kdbxweb.ProtectedValue.fromString(password);
            dispatch(openFile(password));
        },
        onDrop({ files }) {
            dispatch(loadDroppedFiles(files));
        },
    };
};

const OpenContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Open);

export { OpenContainer as Open };