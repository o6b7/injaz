'use client'

import React, { useState } from 'react'
import ProjectHeader from '../ProjectHeader'
import Board from '../BoardView'
import List from '../ListView'
import Timeline from '../TimelineView'
import TableView from '../TableView'
import ModalNewTask from '@/components/ModalNewTask'

type Props = {
    params: {id: string}
}

const Project = ({ params }: Props) => {
    const { id } = params;
    const [activeTab, setActiveTab] = useState("Board");
    const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

  return (
    <div>
      <ModalNewTask isOpen={isModalNewTaskOpen} onClose={() => setIsModalNewTaskOpen(false)} projectId={Number(id)}/>
      {/* NEW TASK MODAL */}
      <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab}/>
      { activeTab === "لوحة" && (
        <Board id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen}/>
      )}
      { activeTab === "قائمة" && (
        <List id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen}/>
      )}
      { activeTab === "الجدول الزمني" && (        
        <Timeline id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen}/>
      )}
      { activeTab === "جدول" && (        
        <TableView id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen}/>
      )}

    </div>
  )
}

export default Project
