function define_role_permissions (acl) {
  acl.allow([
    {
      roles: ['user'],
      allows: [
        {
          resources: ['/', '/users'],
          permissions: ['get', 'post'],
        },
      ],
    },
    {
      roles: ['admin'],
      allows: [
        {
          resources: ['/info'],
          permissions: ['get', 'post'],
        },
      ],
    },
  ]);
  // Admin can do what user do
  acl.addRoleParents('admin', 'user');
}

module.exports = define_role_permissions;
