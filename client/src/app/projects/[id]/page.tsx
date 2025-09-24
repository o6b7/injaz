'use client'

import React, { useState } from 'react'
import ProjectHeader from '../ProjectHeader'

type Props = {
    params: {id: string}
}

const Project = ({ params }: Props) => {
    const { id } = params;
    const [activeTab, setActiveTab] = useState("Board");
    const [isModalNewTaskOpen, setIOsModalNewTaskOpen] = useState(false);

  return (
    <div>
      {/* NEW TASK MODAL */}
      <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab}/>
      {/* { activeTab === "Board" && (
        <Board />
      )} */}

    </div>
  )
}

export default Project
