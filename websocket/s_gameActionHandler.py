import serverless_sdk
sdk = serverless_sdk.SDK(
    org_id='edwardhorsey',
    application_name='poker',
    app_uid='p4c8kgn2t2N3p0J9SR',
    org_uid='GNrn6TstKQv7Qc8m9D',
    deployment_uid='f1448f46-bb88-4d8e-a7c9-9890dbdf67c4',
    service_name='poker',
    should_log_meta=True,
    should_compress_logs=True,
    disable_aws_spans=False,
    disable_http_spans=False,
    stage_name='dev',
    plugin_version='4.4.2',
    disable_frameworks_instrumentation=False,
    serverless_platform_stage='prod'
)
handler_wrapper_kwargs = {'function_name': 'poker-dev-gameActionHandler', 'timeout': 29}
try:
    user_handler = serverless_sdk.get_user_handler('game_action_handler.handle')
    handler = sdk.handler(user_handler, **handler_wrapper_kwargs)
except Exception as error:
    e = error
    def error_handler(event, context):
        raise e
    handler = sdk.handler(error_handler, **handler_wrapper_kwargs)
