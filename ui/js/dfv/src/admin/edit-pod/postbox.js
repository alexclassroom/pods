import React from 'react';

import { withSelect, withDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { Dashicon, Spinner } from '@wordpress/components';

import {
	SAVE_STATUSES,
	DELETE_STATUSES,
} from 'dfv/src/store/constants';

export const Postbox = ( {
	podID,
	options,
	saveStatus,
	deleteStatus,
	savePod,
	deletePod,
} ) => {
	const isSaving = saveStatus === SAVE_STATUSES.SAVING;

	const deleteHandler = () => {
		// eslint-disable-next-line no-alert
		const confirm = window.confirm(
			// eslint-disable-next-line @wordpress/i18n-no-collapsible-whitespace
			__( 'You are about to permanently delete this pod configuration, make sure you have recent backups just in case. Are you sure you would like to delete this Pod?\n\nClick \'OK\' to continue, or \'Cancel\' to make no changes.', 'pods' )
		);

		if ( confirm ) {
			deletePod( podID );
		}
	};

	useEffect( () => {
		// Redirect if the Pod has successfully been deleted.
		if ( deleteStatus === DELETE_STATUSES.DELETE_SUCCESS ) {
			window.location.replace( window.podsDFVConfig.admin_url + 'admin.php?page=pods&deleted=1' );
		}
	}, [ deleteStatus ] );

	return (
		<div id="postbox-container-1" className="postbox-container pods_floatmenu">
			<div id="side-info-field" className="inner-sidebar">
				<div id="side-sortables">
					<div id="submitdiv" className="postbox pods-no-toggle">
						<h3>
							<span>
								{ __( 'Manage', 'pods' ) }
							</span>
						</h3>
						<div className="inside">
							<div className="submitbox" id="submitpost">
								<div id="minor-publishing">
									<div id="misc-publishing-actions">
										<div className="misc-pub-section pods-pod-type">
											<span>
												<Dashicon icon="admin-page" size="16" />
												{ __( 'Type', 'pods' ) }: <strong>{ window.podsAdminConfig.currentPod.podType.label }</strong>
											</span>
										</div>
										<div className="misc-pub-section pods-storage-type">
											<span>
												<Dashicon icon="database" size="16" />
												{ __( 'Storage', 'pods' ) }: <strong>{ window.podsAdminConfig.currentPod.storageType.label }</strong>
											</span>
										</div>
										<div className="clear"></div>
									</div>
								</div>
								<div id="major-publishing-actions">
									<div id="delete-action">
										<button
											onClick={ deleteHandler }
											className="components-button editor-post-trash is-link"
											disabled={ isSaving }
											aria-disabled={ isSaving }
										>
											{ __( 'Delete Pod', 'pods' ) }
										</button>
									</div>
									<div id="publishing-action">
										{ isSaving && <Spinner /> }
										{ '\u00A0' /* &nbsp; */ }
										<button
											className="button-primary"
											type="submit"
											disabled={ isSaving }
											aria-disabled={ isSaving }
											onClick={ () => savePod( options, podID ) }
										>
											{ __( 'Save Pod', 'pods' ) }
										</button>
									</div>
									<div className="clear"></div>
								</div>
							</div>
						</div>
					</div>
					<div className="pods-submittable-fields">
						<div id="side-sortables" className="meta-box-sortables"></div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default compose( [
	withSelect( ( select, ownProps ) => {
		const { storeKey } = ownProps;

		const storeSelect = select( storeKey );

		return {
			saveStatus: storeSelect.getSaveStatus(),
			deleteStatus: storeSelect.getDeleteStatus(),
			podID: storeSelect.getPodID(),
			options: storeSelect.getPodOptions(),
		};
	} ),
	withDispatch( ( dispatch, ownProps ) => {
		const { storeKey } = ownProps;

		const storeDispatch = dispatch( storeKey );

		return {
			savePod: storeDispatch.savePod,
			deletePod: storeDispatch.deletePod,
			setOptionsValues: storeDispatch.setOptionsValues,
			setPodName: storeDispatch.setPodName,
		};
	} ),
] )( Postbox );
