import React from 'react'

interface UserListProps {
  readonly users: readonly string[]
}

export const UserList = ({ users }: UserListProps) => (
  <div>
    <h2>Users Watching</h2>
    <ul>
      { users.map(userId => <li key={userId}>{ userId }</li>) }
    </ul>
  </div>
)
