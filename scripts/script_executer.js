module.exports = async (execute, context) => {
    const path = require('path');

    const project_root = context.opts.projectRoot;
    const root = path.join(project_root, 'platforms');

    for(let i = 0; i < context.opts.platforms.length; i++) {
        const src = path.join(root, _get_platform_path(context.opts.platforms[i]));
        await execute(src);
    }
}

function _get_platform_path(platform) {
    switch (platform) {
        case 'android':
            return 'android/app/src/main/assets/www'
        case 'browser':
            return 'browser/www';
        default:
            throw Error(`Unknown platform "${platform}"`);
    }
}